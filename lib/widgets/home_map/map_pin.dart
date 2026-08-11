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
    return '''
<svg viewBox="0 0 28 36" fill="none">
  <path d="M14 1.5C7.1 1.5 1.5 7 1.5 13.8c0 9.7 12.5 20.7 12.5 20.7s12.5-11 12.5-20.7C26.5 7 20.9 1.5 14 1.5z"
    fill="$fillHex" stroke="#ffffff" stroke-width="2.5"/>
  <circle cx="14" cy="13.5" r="4.4" fill="#ffffff"/>
  $innerDot
</svg>''';
  }

  @override
  Widget build(BuildContext context) {
    final scale = state == PinState.selected ? 1.35 : 1.0;
    return Transform.scale(
      scale: scale,
      alignment: Alignment.bottomCenter,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          DecoratedBox(
            decoration: BoxDecoration(boxShadow: _shadow),
            child: SvgPicture.string(_svg, width: 28, height: 36),
          ),
          if (state == PinState.selected)
            Transform.translate(
              offset: const Offset(0, -8),
              child: Container(
                width: 36,
                height: 10,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(99),
                  color: AppColors.primaryPressed.withValues(alpha: 0.25),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
