# app/model/depth_to_mesh.py

import numpy as np
import open3d as o3d
from PIL import Image
import os
import torch
from transformers import pipeline
from datetime import datetime
import gridfs
from app.db import get_db

# Load depth estimation model only once
depth_pipe = pipeline(
    task="depth-estimation",
    model="depth-anything/Depth-Anything-V2-Large-hf",
    torch_dtype=torch.float32,
    device=0
)

def generate_mesh_from_image_local(image_path, username):
    # Open image
    image = Image.open(image_path)

    # Generate depth map
    result = depth_pipe(image)
    depth_map = np.array(result["depth"])

    # Create Open3D structures
    image_np = np.array(image)
    color_image = o3d.geometry.Image(image_np)
    depth_o3d = o3d.geometry.Image(depth_map.astype(np.float32))

    width, height = depth_map.shape[1], depth_map.shape[0]
    fx = fy = max(width, height) * 1.2
    cx, cy = width / 2, height / 2
    intrinsic = o3d.camera.PinholeCameraIntrinsic(width=width, height=height, fx=fx, fy=fy, cx=cx, cy=cy)

    rgbd = o3d.geometry.RGBDImage.create_from_color_and_depth(
        color_image, depth_o3d, depth_scale=1000.0, depth_trunc=10.0, convert_rgb_to_intensity=False
    )

    pcd = o3d.geometry.PointCloud.create_from_rgbd_image(rgbd, intrinsic)
    pcd.transform([[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]])

    pcd, _ = pcd.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0)
    pcd.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=0.1, max_nn=30))
    pcd.orient_normals_towards_camera_location(camera_location=np.array([0., 0., 0.]))

    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd, depth=9, width=0, scale=1.1, linear_fit=False
    )

    vertices_to_remove = densities < np.quantile(densities, 0.1)
    mesh.remove_vertices_by_mask(vertices_to_remove)
    mesh.compute_vertex_normals()

    # Save mesh temporarily
    mesh_filename = os.path.basename(image_path).split('.')[0] + '_model.obj'
    temp_mesh_path = os.path.join('uploads', mesh_filename)
    o3d.io.write_triangle_mesh(temp_mesh_path, mesh)

    # Upload .obj to MongoDB
    db = get_db()
    fs_models = gridfs.GridFS(db, collection="models")

    with open(temp_mesh_path, "rb") as f:
        file_id = fs_models.put(f, filename=mesh_filename, metadata={
            'username': username,
            'uploadTime': datetime.utcnow(),
            'contentType': 'model/obj'
        })

    # Cleanup mesh file
    os.remove(temp_mesh_path)

    return file_id, mesh_filename
