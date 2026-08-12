import 'dart:io';

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'dashed_border_box.dart';

/// One-photo picker used by Laporan Kondisi. Empty state shows a dashed
/// upload prompt; filled state shows a thumbnail + filename/size + remove.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Photo upload.
class SinglePhotoUploadField extends StatelessWidget {
  const SinglePhotoUploadField({
    super.key,
    required this.photo,
    required this.onPick,
    required this.onRemove,
  });

  final File? photo;
  final Future<void> Function() onPick;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    if (photo == null) {
      return GestureDetector(
        onTap: onPick,
        child: DashedBorderBox(
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 20),
            decoration: BoxDecoration(
              color: AppColors.surfaceSand,
              borderRadius: BorderRadius.circular(AppRadius.cardLg),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                  child: const Icon(Icons.camera_alt_outlined, color: Colors.white, size: 20),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tambah foto',
                  style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primaryPressed),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final fileSizeKb = (photo!.lengthSync() / 1024).toStringAsFixed(0);
    final fileName = photo!.uri.pathSegments.last;

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(AppRadius.cardLg)),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.file(photo!, width: 70, height: 70, fit: BoxFit.cover),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fileName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.ink),
                ),
                const SizedBox(height: 2),
                Text('$fileSizeKb KB', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
              ],
            ),
          ),
          GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 30,
              height: 30,
              decoration: const BoxDecoration(color: AppColors.disabledFill, shape: BoxShape.circle),
              child: const Icon(Icons.close, size: 16, color: AppColors.body),
            ),
          ),
        ],
      ),
    );
  }
}
