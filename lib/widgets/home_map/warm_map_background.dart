import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

/// Warm-toned decorative map background — beige land, sage parks, white
/// roads, faint street labels.
///
/// This mirrors `WarmMapBg` from design_handoff_momspace/home-map.jsx
/// (viewBox 0 0 380 800, `preserveAspectRatio="xMidYMid slice"`). Per the
/// handoff, the map is an intentional placeholder abstraction — production
/// should swap it for a real map SDK styled with the same warm palette.
class WarmMapBackground extends StatelessWidget {
  const WarmMapBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _WarmMapPainter(),
      size: Size.infinite,
    );
  }
}

const List<Rect> _blocksA = [
  Rect.fromLTWH(20, 180, 120, 80),
  Rect.fromLTWH(160, 180, 80, 80),
  Rect.fromLTWH(20, 280, 80, 100),
  Rect.fromLTWH(120, 280, 120, 60),
  Rect.fromLTWH(200, 620, 100, 80),
  Rect.fromLTWH(20, 660, 100, 80),
];

const List<Rect> _blocksB = [
  Rect.fromLTWH(140, 280, 60, 40),
  Rect.fromLTWH(60, 360, 60, 40),
  Rect.fromLTWH(250, 280, 50, 50),
  Rect.fromLTWH(40, 700, 60, 40),
];

class _WarmMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    const double viewW = 380;
    const double viewH = 800;
    // `xMidYMid slice` == CSS `background-size: cover`, centered.
    final scale = math.max(size.width / viewW, size.height / viewH);
    final dx = (size.width - viewW * scale) / 2;
    final dy = (size.height - viewH * scale) / 2;

    canvas.save();
    canvas.translate(dx, dy);
    canvas.scale(scale);

    canvas.drawRect(
      const Rect.fromLTWH(0, 0, viewW, viewH),
      Paint()..color = AppColors.mapLand,
    );

    final park1 = Path()
      ..moveTo(-20, 420)
      ..quadraticBezierTo(60, 380, 120, 430)
      ..quadraticBezierTo(180, 480, 240, 410)
      ..quadraticBezierTo(300, 400, 330, 460)
      ..lineTo(340, 540)
      ..quadraticBezierTo(280, 580, 200, 560)
      ..quadraticBezierTo(120, 540, 60, 600)
      ..lineTo(-20, 580)
      ..close();
    final park2 = Path()
      ..moveTo(260, 100)
      ..quadraticBezierTo(310, 90, 340, 130)
      ..lineTo(350, 200)
      ..quadraticBezierTo(310, 220, 280, 200)
      ..quadraticBezierTo(250, 180, 240, 160)
      ..close();
    final parkPaint = Paint()..color = AppColors.mapPark.withValues(alpha: 0.85);
    canvas.drawPath(park1, parkPaint);
    canvas.drawPath(park2, parkPaint);

    final water = Path()
      ..moveTo(280, 720)
      ..quadraticBezierTo(340, 700, 400, 720)
      ..lineTo(400, 820)
      ..lineTo(280, 820)
      ..close();
    canvas.drawPath(water, Paint()..color = AppColors.mapWater.withValues(alpha: 0.95));

    final blockAPaint = Paint()..color = AppColors.mapBlockA.withValues(alpha: 0.65);
    for (final r in _blocksA) {
      canvas.drawRRect(RRect.fromRectAndRadius(r, const Radius.circular(6)), blockAPaint);
    }
    final blockBPaint = Paint()..color = AppColors.mapBlockB.withValues(alpha: 0.5);
    for (final r in _blocksB) {
      canvas.drawRRect(RRect.fromRectAndRadius(r, const Radius.circular(4)), blockBPaint);
    }

    final road1 = Path()
      ..moveTo(-10, 260)
      ..quadraticBezierTo(100, 270, 200, 250)
      ..quadraticBezierTo(300, 230, 390, 240);
    final road2 = Path()
      ..moveTo(-10, 380)
      ..quadraticBezierTo(120, 400, 220, 380)
      ..quadraticBezierTo(320, 360, 390, 360);
    final road3 = Path()
      ..moveTo(-10, 640)
      ..quadraticBezierTo(120, 650, 220, 640)
      ..quadraticBezierTo(320, 630, 390, 620);
    final road4 = Path()
      ..moveTo(180, -10)
      ..quadraticBezierTo(170, 200, 200, 380)
      ..quadraticBezierTo(230, 560, 230, 820);
    final road5 = Path()
      ..moveTo(60, -10)
      ..quadraticBezierTo(80, 180, 50, 380)
      ..quadraticBezierTo(20, 580, 80, 820);

    for (final entry in [
      (road1, 22.0),
      (road2, 18.0),
      (road3, 20.0),
      (road4, 22.0),
      (road5, 16.0),
    ]) {
      canvas.drawPath(
        entry.$1,
        Paint()
          ..color = AppColors.mapRoad
          ..style = PaintingStyle.stroke
          ..strokeWidth = entry.$2
          ..strokeCap = StrokeCap.round,
      );
    }

    final centerlinePaint = Paint()
      ..color = AppColors.primaryTint.withValues(alpha: 0.7)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round;
    _drawDashedPath(canvas, road1, centerlinePaint, dashLength: 6, gapLength: 8);
    _drawDashedPath(canvas, road4, centerlinePaint, dashLength: 6, gapLength: 8);

    final secondaryPaint = Paint()
      ..color = AppColors.mapRoad.withValues(alpha: 0.85)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(const Offset(20, 480), const Offset(360, 470), secondaryPaint);
    canvas.drawLine(const Offset(20, 540), const Offset(360, 530), secondaryPaint);
    canvas.drawLine(const Offset(120, 100), const Offset(130, 800), secondaryPaint);
    canvas.drawLine(const Offset(300, 100), const Offset(310, 800), secondaryPaint);

    _drawLabel(canvas, 'JL. THAMRIN', const Offset(46, 220), -2 * math.pi / 180);
    _drawLabel(canvas, 'SUDIRMAN', const Offset(220, 500), 3 * math.pi / 180);
    _drawLabel(canvas, 'MENTENG', const Offset(260, 160), 0);

    canvas.restore();
  }

  void _drawDashedPath(
    Canvas canvas,
    Path path,
    Paint paint, {
    required double dashLength,
    required double gapLength,
  }) {
    for (final metric in path.computeMetrics()) {
      var distance = 0.0;
      while (distance < metric.length) {
        final next = math.min(distance + dashLength, metric.length);
        canvas.drawPath(metric.extractPath(distance, next), paint);
        distance = next + gapLength;
      }
    }
  }

  void _drawLabel(Canvas canvas, String text, Offset anchor, double angle) {
    final painter = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          fontFamily: AppTypography.nunitoFamily,
          fontWeight: FontWeight.w700,
          fontSize: 9,
          color: const Color(0xFFB9A38F).withValues(alpha: 0.7),
        ),
      ),
      textDirection: ui.TextDirection.ltr,
    )..layout();
    canvas.save();
    canvas.translate(anchor.dx, anchor.dy);
    canvas.rotate(angle);
    painter.paint(canvas, Offset(0, -painter.height * 0.85));
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _WarmMapPainter oldDelegate) => false;
}
