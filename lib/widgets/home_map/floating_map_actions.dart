import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_shadows.dart';

const String _layersGlyph = '''
<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="{{c}}" stroke-width="1.9" stroke-linejoin="round"/>
  <path d="M3 13l9 5 9-5" stroke="{{c}}" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M3 17l9 5 9-5" stroke="{{c}}" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round" opacity="0.5"/>
</svg>''';

const String _locateGlyph = '''
<svg viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="3.5" fill="{{c}}"/>
  <circle cx="12" cy="12" r="7" stroke="{{c}}" stroke-width="2" opacity="0.5"/>
  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="{{c}}" stroke-width="2" stroke-linecap="round"/>
</svg>''';

/// Stacked floating map controls (layers + locate-me). Source:
/// home-map.jsx `FloatingActions`.
class FloatingMapActions extends StatelessWidget {
  const FloatingMapActions({super.key, this.onLayersTap, this.onLocateTap});

  final VoidCallback? onLayersTap;
  final VoidCallback? onLocateTap;

  static String _hex(Color c) => '#${c.toARGB32().toRadixString(16).substring(2)}';

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        _FloatingButton(
          svg: _layersGlyph.replaceAll('{{c}}', _hex(AppColors.ink)),
          background: Colors.white,
          glyphSize: 20,
          onTap: onLayersTap,
        ),
        const SizedBox(height: 10),
        _FloatingButton(
          svg: _locateGlyph.replaceAll('{{c}}', '#ffffff'),
          background: AppColors.primary,
          glyphSize: 22,
          onTap: onLocateTap,
        ),
      ],
    );
  }
}

class _FloatingButton extends StatelessWidget {
  const _FloatingButton({
    required this.svg,
    required this.background,
    required this.glyphSize,
    this.onTap,
  });

  final String svg;
  final Color background;
  final double glyphSize;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: background,
      shape: const CircleBorder(),
      elevation: 0,
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: Container(
          width: 46,
          height: 46,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: AppShadows.floatingButton,
          ),
          child: SvgPicture.string(svg, width: glyphSize, height: glyphSize),
        ),
      ),
    );
  }
}
