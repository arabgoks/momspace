import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_shadows.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'nav_icons.dart';

class NavTab {
  const NavTab({required this.glyph, required this.label});
  final NavGlyph glyph;
  final String label;
}

/// The four MomSpace root tabs, in fixed order: Map · Search · Report · Profile.
const List<NavTab> momSpaceTabs = [
  NavTab(glyph: NavGlyph.map, label: 'Map'),
  NavTab(glyph: NavGlyph.search, label: 'Search'),
  NavTab(glyph: NavGlyph.report, label: 'Report'),
  NavTab(glyph: NavGlyph.profile, label: 'Profile'),
];

/// MomSpace bottom navigation — "Classic Pill" treatment.
///
/// A soft rose pill sits behind the active tab's icon; active icons render
/// filled, inactive ones render outline. Persistent across the app's root
/// screens. Source: design_handoff_momspace/README.md § 1, navbars.jsx
/// `NavbarClassic`.
class ClassicPillNavBar extends StatelessWidget {
  const ClassicPillNavBar({
    super.key,
    required this.activeIndex,
    required this.onChanged,
    this.showLabels = true,
  });

  final int activeIndex;
  final ValueChanged<int> onChanged;
  final bool showLabels;

  @override
  Widget build(BuildContext context) {
    // README: padding-bottom 28 approximates the iOS home-indicator safe
    // area; on real devices (iOS or Android) defer to the reported system
    // inset instead, falling back to 28 where none is reported.
    final systemInset = MediaQuery.paddingOf(context).bottom;
    final bottomPadding = systemInset > 0 ? systemInset : AppSpacing.s28;

    return DecoratedBox(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.divider, width: 1)),
      ),
      child: Padding(
        padding: EdgeInsets.only(top: AppSpacing.s10, bottom: bottomPadding),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            for (var i = 0; i < momSpaceTabs.length; i++)
              Expanded(
                child: _ClassicPillTab(
                  tab: momSpaceTabs[i],
                  active: i == activeIndex,
                  showLabel: showLabels,
                  onTap: () => onChanged(i),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _ClassicPillTab extends StatelessWidget {
  const _ClassicPillTab({
    required this.tab,
    required this.active,
    required this.showLabel,
    required this.onTap,
  });

  final NavTab tab;
  final bool active;
  final bool showLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? AppColors.primary : AppColors.placeholder;

    return Semantics(
      button: true,
      selected: active,
      label: tab.label,
      child: InkWell(
        onTap: onTap,
        overlayColor: WidgetStateProperty.all(Colors.transparent),
        child: ConstrainedBox(
          constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.s6),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedContainer(
                  duration: AppMotion.fast,
                  curve: AppMotion.standard,
                  width: 44,
                  height: 32,
                  decoration: BoxDecoration(
                    color: active
                        ? AppColors.primary.withValues(alpha: 0.16)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  alignment: Alignment.center,
                  child: NavIcon(glyph: tab.glyph, filled: active, color: color),
                ),
                if (showLabel) ...[
                  const SizedBox(height: AppSpacing.s4),
                  Text(tab.label, style: AppTypography.navLabel(color: color)),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
