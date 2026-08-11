import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../theme/app_colors.dart';

const String _starPath =
    'M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z';

/// Five-point rating star, full or half-filled.
/// Source: home-map.jsx `Star`.
class RatingStar extends StatelessWidget {
  const RatingStar({super.key, this.half = false, this.size = 13});

  final bool half;
  final double size;

  static String _hex(Color c) => '#${c.toARGB32().toRadixString(16).substring(2)}';

  @override
  Widget build(BuildContext context) {
    final rose = _hex(AppColors.primary);
    final svg = half
        ? '''
<svg viewBox="0 0 24 24">
  <defs>
    <linearGradient id="halfStarGrad">
      <stop offset="50%" stop-color="$rose"/>
      <stop offset="50%" stop-color="#E6D9CE"/>
    </linearGradient>
  </defs>
  <path d="$_starPath" fill="url(#halfStarGrad)"/>
</svg>'''
        : '''
<svg viewBox="0 0 24 24">
  <path d="$_starPath" fill="$rose"/>
</svg>''';
    return SvgPicture.string(svg, width: size, height: size);
  }
}
