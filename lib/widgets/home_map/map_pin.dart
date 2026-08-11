import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../theme/app_colors.dart';

enum PinState { available, selected, closed }

/// A lactation-room map marker. Source: home-map.jsx `Pin`.
///
/// 28×36 teardrop, white 2.5px stroke, white inner dot. Selected pins render
/// 1.35× larger with a rose inner dot, a soft ground-shadow ellipse beneath,
/// and a stronger drop shadow.
class MapPin extends StatelessWidget {
  const MapPin({super.key, required this.state});

  final PinState state;

  Color get _fill => switch (state) {
        PinState.selected => AppColors.primaryPressed,
        PinState.available => AppColors.primary,
        PinState.closed => AppColors.pinClosed,
      };

  List<BoxShadow> get _shadow => state == PinState.selected
      ? const [
          BoxShadow(
            color: Color(0x8CD88B7C), // rgba(216,139,124,0.55)
            offset: Offset(0, 8),
            blurRadius: 14,
          ),
        ]
      : const [
          BoxShadow(
            color: Color(0x2E3C281E), // rgba(60,40,30,0.18)
            offset: Offset(0, 3),
            blurRadius: 5,
          ),
        ];

  static String _hex(Color c) => '#${c.toARGB32().toRadixString(16).substring(2)}';

  String get _svg {
    final fillHex = _hex(_fill);
    final innerDot = state == PinState.selected
        ? '<circle cx="14" cy="13.5" r="1.8" fill="${_hex(AppColors.primaryPressed)}"/>'
        : '';
        
    final filter = state == PinState.selected
        ? '<filter id="ds" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#D88B7C" flood-opacity="0.55"/></filter>'
        : '<filter id="ds" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#3C281E" flood-opacity="0.18"/></filter>';

    return '''
<svg viewBox="0 0 28 36" fill="none" overflow="visible">
  $filter
  <g filter="url(#ds)">
    <path d="M14 1.5C7.1 1.5 1.5 7 1.5 13.8c0 9.7 12.5 20.7 12.5 20.7s12.5-11 12.5-20.7C26.5 7 20.9 1.5 14 1.5z"
      fill="$fillHex" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="14" cy="13.5" r="4.4" fill="#ffffff"/>
    $innerDot
  </g>
</svg>''';
  }

  @override
  Widget build(BuildContext context) {
    final scale = state == PinState.selected ? 1.35 : 1.0;
    return Transform.scale(
      scale: scale,
      alignment: Alignment.bottomCenter,
      child: SizedBox(
        width: 28,
        height: 36,
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.bottomCenter,
          children: [
            if (state == PinState.selected)
              Positioned(
                bottom: -2,
                child: Container(
                  width: 36,
                  height: 10,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(99),
                    color: AppColors.primaryPressed.withValues(alpha: 0.25),
                  ),
                ),
              ),
            SvgPicture.string(
              _svg,
              width: 28,
              height: 36,
              clipBehavior: Clip.none,
            ),
          ],
        ),
      ),
    );
  }
}
