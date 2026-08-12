import 'package:flutter/material.dart';

import '../../models/location_submission.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

/// 3-state status pill for a submitted location.
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru ›
/// Status pill component.
class SubmissionStatusPill extends StatelessWidget {
  const SubmissionStatusPill({super.key, required this.status});

  final SubmissionStatus status;

  @override
  Widget build(BuildContext context) {
    final (bg, border, text, label) = switch (status) {
      SubmissionStatus.pending => (AppColors.amberTint, AppColors.amberBorder, AppColors.amber, 'Pending verifikasi'),
      SubmissionStatus.approved => (AppColors.sageTint, AppColors.secondary.withValues(alpha: 0.36), AppColors.sageDk, 'Disetujui & tayang'),
      SubmissionStatus.rejected => (const Color(0x1FC97A6E), const Color(0x47C97A6E), AppColors.primaryDeep, 'Ditolak'),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999), border: Border.all(color: border)),
      child: Text(label, style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w700, color: text)),
    );
  }
}
