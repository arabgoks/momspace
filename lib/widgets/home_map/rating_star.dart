import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../theme/app_colors.dart';

const String _starPath =
    'M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z';
const String _starUnfilled = '#E6D9CE';

/// Five-point rating star, filled from 0 (empty) to 1 (full).
/// Source: home-map.jsx `Star` (generalized from its full/half-only gradient
/// so a rating row can be driven directly by `Room.rating`).
class RatingStar extends StatelessWidget {
  const RatingStar({super.key, this.fraction = 1.0, this.size = 13});

  /// Portion of the star filled with the rose color, 0 (empty) to 1 (full).
  final double fraction;
  final double size;

  static String _hex(Color c) => '#${c.toARGB32().toRadixString(16).substring(2)}';

  /// Builds a 5-star row for [rating], flooring to the nearest half-star
  /// (e.g. 4.8 → 4 full + 1 half) so the display never overstates the score.
  static List<Widget> rowFor(double rating, {double size = 13}) {
    final halfSteps = (rating * 2).floor().clamp(0, 10);
    final full = halfSteps ~/ 2;
    final hasHalf = halfSteps.isOdd;
    return [
      for (var i = 0; i < 5; i++)
        RatingStar(
          key: ValueKey(i),
          size: size,
          fraction: i < full
              ? 1.0
              : (i == full && hasHalf ? 0.5 : 0.0),
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final rose = _hex(AppColors.primary);
    final clamped = fraction.clamp(0.0, 1.0);
    if (clamped == 1.0 || clamped == 0.0) {
      final color = clamped == 1.0 ? rose : _starUnfilled;
      return SvgPicture.string(
        '<svg viewBox="0 0 24 24"><path d="$_starPath" fill="$color"/></svg>',
        width: size,
        height: size,
      );
    }
    final pct = (clamped * 100).toStringAsFixed(2);
    final svg = '''
<svg viewBox="0 0 24 24">
  <defs>
    <linearGradient id="starGrad">
      <stop offset="$pct%" stop-color="$rose"/>
      <stop offset="$pct%" stop-color="$_starUnfilled"/>
    </linearGradient>
  </defs>
  <path d="$_starPath" fill="url(#starGrad)"/>
</svg>''';
    return SvgPicture.string(svg, width: size, height: size);
  }
}
