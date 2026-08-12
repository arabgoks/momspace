import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';

/// "+N poin kontribusi" banner shown at the bottom of Laporan Kondisi.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Reward banner.
class RewardBanner extends StatelessWidget {
  const RewardBanner({super.key, this.points = 10});

  final int points;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(AppRadius.cardLg),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.star_rounded, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink),
                    children: [
                      const TextSpan(text: 'Laporan ini memberi Anda '),
                      TextSpan(text: '+$points poin kontribusi', style: const TextStyle(fontWeight: FontWeight.w800)),
                    ],
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Poin dapat dilihat di halaman Profil',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
