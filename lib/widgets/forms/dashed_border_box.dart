import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';

/// Draws a dashed rounded-rect border around [child].
/// Flutter has no built-in dashed border, so this hand-rolls one via
/// [Path.computeMetrics] rather than pulling in a dependency for it.
class DashedBorderBox extends StatelessWidget {
  const DashedBorderBox({
    super.key,
    required this.child,
    this.color = AppColors.primary,
    this.radius = AppRadius.cardLg,
    this.strokeWidth = 2,
    this.dashWidth = 6,
    this.dashGap = 4,
  });

  final Widget child;
  final Color color;
  final double radius;
  final double strokeWidth;
  final double dashWidth;
  final double dashGap;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _DashedRRectPainter(
        color: color,
        radius: radius,
        strokeWidth: strokeWidth,
        dashWidth: dashWidth,
        dashGap: dashGap,
      ),
      child: child,
    );
  }
}

class _DashedRRectPainter extends CustomPainter {
  _DashedRRectPainter({
    required this.color,
    required this.radius,
    required this.strokeWidth,
    required this.dashWidth,
    required this.dashGap,
  });

  final Color color;
  final double radius;
  final double strokeWidth;
  final double dashWidth;
  final double dashGap;

  @override
  void paint(Canvas canvas, Size size) {
    final rrect = RRect.fromRectAndRadius(
      Rect.fromLTWH(
        strokeWidth / 2,
        strokeWidth / 2,
        size.width - strokeWidth,
        size.height - strokeWidth,
      ),
      Radius.circular(radius),
    );
    final path = Path()..addRRect(rrect);
    _drawDashedPath(canvas, path, color, strokeWidth, dashWidth, dashGap);
  }

  @override
  bool shouldRepaint(covariant _DashedRRectPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.radius != radius;
}

/// Rotating dashed ring used behind the success/pending celebration badges.
/// Source: README.md § Interactions & Behavior › Animations
/// ("Dashed ring spin — 12–14s linear infinite").
class DashedRingPainter extends CustomPainter {
  const DashedRingPainter({this.color = AppColors.secondary});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final path = Path()..addOval(Offset.zero & size);
    _drawDashedPath(canvas, path, color.withValues(alpha: 0.4), 2, 6, 5);
  }

  @override
  bool shouldRepaint(covariant DashedRingPainter oldDelegate) =>
      oldDelegate.color != color;
}

void _drawDashedPath(
  Canvas canvas,
  Path path,
  Color color,
  double strokeWidth,
  double dashWidth,
  double dashGap,
) {
  final paint = Paint()
    ..color = color
    ..style = PaintingStyle.stroke
    ..strokeWidth = strokeWidth;

  for (final metric in path.computeMetrics()) {
    double distance = 0;
    while (distance < metric.length) {
      final next = distance + dashWidth;
      canvas.drawPath(
        metric.extractPath(distance, next.clamp(0, metric.length)),
        paint,
      );
      distance = next + dashGap;
    }
  }
}
