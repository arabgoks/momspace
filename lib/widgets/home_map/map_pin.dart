import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../theme/app_colors.dart';

enum PinState { available, selected, closed }

const double _pinWidth = 28;
const double _pinHeight = 36;

/// Skia's blur-radius-to-sigma conversion (`SkBlurMask::ConvertRadiusToSigma`),
/// so the hand-rolled shadow blur lines up with the `blurRadius` numbers used
/// by the rest of the app's `BoxShadow` specs.
double _blurSigma(double radius) => radius * 0.57735 + 0.5;

const String _pinPath =
    'M14 1.5C7.1 1.5 1.5 7 1.5 13.8c0 9.7 12.5 20.7 12.5 20.7s12.5-11 12.5-20.7C26.5 7 20.9 1.5 14 1.5z';

/// A lactation-room map marker. Source: home-map.jsx `Pin`.
///
/// 28×36 teardrop, white 2.5px stroke, white inner dot. Selected pins render
/// 1.35× larger with a rose inner dot, a soft ground-shadow ellipse beneath,
/// and a stronger drop shadow.
///
/// The drop shadow is painted as a second, blurred copy of the teardrop
/// silhouette (rather than a `BoxShadow`, which would draw a rectangular
/// smear behind the SVG's bounding box) so it follows the pin's shape. The
/// widget's own layout size is pinned to 28×36 in every state — the
/// selected-only ground ellipse is painted via a `Positioned` child inside a
/// `Stack(clipBehavior: Clip.none)` so it overflows below that box instead
/// of adding to it, keeping the pin tip anchored under
/// `FractionalTranslation(-0.5, -1)` regardless of state.
class MapPin extends StatelessWidget {
  const MapPin({super.key, required this.state});

  final PinState state;

  Color get _fill => switch (state) {
        PinState.selected => AppColors.primaryPressed,
        PinState.available => AppColors.primary,
        PinState.closed => AppColors.pinClosed,
      };

  Color get _shadowColor => state == PinState.selected
      ? const Color(0x8CD88B7C) // rgba(216,139,124,0.55)
      : const Color(0x2E3C281E); // rgba(60,40,30,0.18)

  Offset get _shadowOffset =>
      state == PinState.selected ? const Offset(0, 8) : const Offset(0, 3);

  double get _shadowBlurRadius => state == PinState.selected ? 14 : 5;

  static String _hex(Color c) => '#${c.toARGB32().toRadixString(16).substring(2)}';

  String get _svg {
    final fillHex = _hex(_fill);
    final innerDot = state == PinState.selected
        ? '<circle cx="14" cy="13.5" r="1.8" fill="${_hex(AppColors.primaryPressed)}"/>'
        : '';
    return '''
<svg viewBox="0 0 28 36" fill="none">
  <path d="$_pinPath" fill="$fillHex" stroke="#ffffff" stroke-width="2.5"/>
  <circle cx="14" cy="13.5" r="4.4" fill="#ffffff"/>
  $innerDot
</svg>''';
  }

  String get _shadowSvg => '''
<svg viewBox="0 0 28 36" fill="none">
  <path d="$_pinPath" fill="${_hex(_shadowColor)}" fill-opacity="${_shadowColor.a.toStringAsFixed(3)}"/>
</svg>''';

  @override
  Widget build(BuildContext context) {
    final scale = state == PinState.selected ? 1.35 : 1.0;
    return Transform.scale(
      scale: scale,
      alignment: Alignment.bottomCenter,
      child: SizedBox(
        width: _pinWidth,
        height: _pinHeight,
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.bottomCenter,
          children: [
            if (state == PinState.selected)
              Positioned(
                bottom: -8,
                child: Container(
                  width: 36,
                  height: 10,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(99),
                    color: AppColors.primaryPressed.withValues(alpha: 0.25),
                  ),
                ),
              ),
            Positioned(
              left: 0,
              top: 0,
              child: Transform.translate(
                offset: _shadowOffset,
                child: ImageFiltered(
                  imageFilter: ui.ImageFilter.blur(
                    sigmaX: _blurSigma(_shadowBlurRadius),
                    sigmaY: _blurSigma(_shadowBlurRadius),
                  ),
                  child: SvgPicture.string(_shadowSvg, width: _pinWidth, height: _pinHeight),
                ),
              ),
            ),
            SvgPicture.string(_svg, width: _pinWidth, height: _pinHeight),
          ],
        ),
      ),
    );
  }
}
