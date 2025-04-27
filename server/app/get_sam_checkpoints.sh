#!/usr/bin/env bash
# Downloads SAM ViT-B (~2 GB) into models/ if not present
set -e
mkdir -p models
FILE=models/sam_vit_b_01ec64.pth
if [ ! -f "$FILE" ]; then
  echo "Downloading SAM ViT-B checkpoint..."
  wget -O "$FILE" \
    https://dl.fbaipublicfiles.com/segment_anything/sam_vit_b_01ec64.pth
else
  echo "SAM checkpoint already exists."
fi
