import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Outline/filled glyph pairs for the bottom nav tabs.
/// Path data is copied verbatim from design_handoff_momspace/nav-icons.jsx
/// (viewBox 0 0 24 24, rendered at 26x26) so the icons match the handoff
/// pixel-for-pixel.
enum NavGlyph { map, search, report, profile }

class NavIcon extends StatelessWidget {
  const NavIcon({
    super.key,
    required this.glyph,
    required this.filled,
    required this.color,
    this.size = 26,
  });

  final NavGlyph glyph;
  final bool filled;
  final Color color;
  final double size;

  static String _hex(Color c) =>
      '#${c.toARGB32().toRadixString(16).substring(2)}';

  String _svg() {
    final cc = _hex(color);
    switch (glyph) {
      case NavGlyph.map:
        return filled
            ? '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z" fill="$cc"/>
  <circle cx="12" cy="9.7" r="2.7" fill="#fff"/>
</svg>'''
            : '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 21s-7-6.2-7-11.5C5 5.4 8.1 2.5 12 2.5s7 2.9 7 7C19 14.8 12 21 12 21z"
    stroke="$cc" stroke-width="1.9" stroke-linejoin="round"/>
  <circle cx="12" cy="9.7" r="2.6" stroke="$cc" stroke-width="1.9"/>
</svg>''';
      case NavGlyph.search:
        return filled
            ? '''
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="11" cy="11" r="7.3" fill="$cc"/>
  <circle cx="11" cy="11" r="3.2" fill="#fff"/>
  <path d="M20.5 20.5l-4.3-4.3" stroke="$cc" stroke-width="2.4" stroke-linecap="round"/>
</svg>'''
            : '''
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="11" cy="11" r="6.8" stroke="$cc" stroke-width="1.9"/>
  <path d="M20.5 20.5l-4.3-4.3" stroke="$cc" stroke-width="2" stroke-linecap="round"/>
</svg>''';
      case NavGlyph.report:
        return filled
            ? '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M4 8.5h3.2l1.3-2h7l1.3 2H20A1.5 1.5 0 0 1 21.5 10v7.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5z" fill="$cc"/>
  <circle cx="12" cy="13.4" r="3.5" fill="#fff"/>
  <circle cx="12" cy="13.4" r="1.6" fill="$cc"/>
</svg>'''
            : '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M4 8.5h3.2l1.3-2h7l1.3 2H20A1.5 1.5 0 0 1 21.5 10v7.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5z"
    stroke="$cc" stroke-width="1.9" stroke-linejoin="round"/>
  <circle cx="12" cy="13.4" r="3.4" stroke="$cc" stroke-width="1.9"/>
</svg>''';
      case NavGlyph.profile:
        return filled
            ? '''
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="8.2" r="3.9" fill="$cc"/>
  <path d="M4.4 20.4c1-3.9 4.2-5.9 7.6-5.9s6.6 2 7.6 5.9" fill="$cc"/>
</svg>'''
            : '''
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="8.2" r="3.6" stroke="$cc" stroke-width="1.9"/>
  <path d="M4.6 20c1-3.7 4.1-5.6 7.4-5.6S18.4 16.3 19.4 20"
    stroke="$cc" stroke-width="1.9" stroke-linecap="round"/>
</svg>''';
    }
  }

  @override
  Widget build(BuildContext context) {
    return SvgPicture.string(
      _svg(),
      width: size,
      height: size,
    );
  }
}
