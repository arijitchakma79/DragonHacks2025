import numpy as np, open3d as o3d

def project(mask, depth_f32, fx=None, fy=None, cx=None, cy=None):
    """mask HxW uint8, depth_f32 PIL.Image F (metres) → (N,3) xyz in metres"""
    d = np.asarray(depth_f32, np.float32)
    h, w = d.shape
    fx = fy = (max(h, w) * 1.2) if fx is None else fx
    cx, cy = (w / 2, h / 2) if cx is None else (cx, cy)

    ys, xs = np.where(mask > 0)
    z = d[ys, xs]
    x = (xs - cx) * z / fx
    y = (ys - cy) * z / fy
    return np.column_stack((x, y, z)).astype(np.float32)

def measure(points):
    if points.shape[0] < 30:
        return None, None
    pcd = o3d.geometry.PointCloud(o3d.utility.Vector3dVector(points))
    bbox = pcd.get_axis_aligned_bounding_box()
    dims = bbox.get_extent()
    pcd.estimate_normals()
    mesh, _ = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd, depth=7)
    area = mesh.get_surface_area()
    return dims, area