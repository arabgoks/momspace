import 'dart:io';

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import 'dashed_border_box.dart';

/// Up-to-N photo grid picker used by Tambah Lokasi Baru (max 3).
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru › Foto lokasi.
class PhotoGridUploadField extends StatelessWidget {
  const PhotoGridUploadField({
    super.key,
    required this.photos,
    required this.maxPhotos,
    required this.onAdd,
    required this.onRemove,
  });

  final List<File> photos;
  final int maxPhotos;
  final Future<void> Function() onAdd;
  final void Function(int index) onRemove;

  @override
  Widget build(BuildContext context) {
    final tiles = <Widget>[
      for (int i = 0; i < photos.length; i++)
        _PhotoTile(file: photos[i], onRemove: () => onRemove(i)),
      if (photos.length < maxPhotos) _AddTile(onTap: onAdd),
    ];

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      children: tiles,
    );
  }
}

class _PhotoTile extends StatelessWidget {
  const _PhotoTile({required this.file, required this.onRemove});

  final File file;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.tileMd),
            child: Image.file(file, fit: BoxFit.cover),
          ),
        ),
        Positioned(
          top: 4,
          right: 4,
          child: GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 22,
              height: 22,
              decoration: const BoxDecoration(color: Color(0xA6333727), shape: BoxShape.circle),
              child: const Icon(Icons.close, size: 13, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }
}

class _AddTile extends StatelessWidget {
  const _AddTile({required this.onTap});

  final Future<void> Function() onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: DashedBorderBox(
        radius: AppRadius.tileMd,
        child: const Center(child: Icon(Icons.add, color: AppColors.primaryPressed)),
      ),
    );
  }
}
