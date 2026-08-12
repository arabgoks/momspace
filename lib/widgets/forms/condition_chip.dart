import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_shadows.dart';
import '../../theme/app_typography.dart';

/// Positive/negative selectable condition chip used on the Laporan Kondisi
/// screen. Source: design_handoff_momspace/README.md § 4 Laporan Kondisi ›
/// Condition quick-select.
class ConditionChip extends StatelessWidget {
  const ConditionChip({
    super.key,
    required this.label,
    required this.isPositive,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool isPositive;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final Color bg;
    final Color border;
    final Color text;
    final Color badgeBg;
    final Color badgeGlyph;
    final IconData? icon;

    if (!selected) {
      bg = Colors.white;
      border = const Color(0x243C281E); // rgba(60,40,30,0.14)
      text = AppColors.textMuted;
      badgeBg = const Color(0xFFF4ECE3);
      badgeGlyph = AppColors.placeholder;
      icon = null;
    } else if (isPositive) {
      bg = AppColors.sageTint;
      border = const Color(0x738FAF8F); // rgba(143,175,143,0.45)
      text = const Color(0xFF5C7A5C);
      badgeBg = AppColors.secondary;
      badgeGlyph = Colors.white;
      icon = Icons.check;
    } else {
      bg = const Color(0x1FC97A6E); // rgba(201,122,110,0.12)
      border = const Color(0x47C97A6E); // rgba(201,122,110,0.28)
      text = AppColors.primaryDeep;
      badgeBg = AppColors.primaryDeep;
      badgeGlyph = Colors.white;
      icon = Icons.close;
    }

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: AppMotion.fast,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: border, width: 1.5),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(color: badgeBg, shape: BoxShape.circle),
              alignment: Alignment.center,
              child: icon != null ? Icon(icon, size: 13, color: badgeGlyph) : null,
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                label,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w700, color: text),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
