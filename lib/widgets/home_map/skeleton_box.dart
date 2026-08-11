import 'package:flutter/material.dart';

/// Shimmering placeholder block used by the sheet's loading state.
/// Source: home-map.jsx `Skeleton` / `@keyframes momShimmer`
/// (1.4s ease-in-out infinite, 400px gradient sweep).
class SkeletonBox extends StatefulWidget {
  const SkeletonBox({super.key, required this.width, required this.height, this.radius = 6});

  final double width;
  final double height;
  final double radius;

  @override
  State<SkeletonBox> createState() => _SkeletonBoxState();
}

class _SkeletonBoxState extends State<SkeletonBox> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = Curves.easeInOut.transform(_controller.value);
        final dx = -1.0 + 2.0 * t;
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(widget.radius),
            gradient: LinearGradient(
              begin: Alignment(dx - 0.5, 0),
              end: Alignment(dx + 0.5, 0),
              colors: const [
                Color(0xFFEEE3D9),
                Color(0xFFF6ECE3),
                Color(0xFFEEE3D9),
              ],
            ),
          ),
        );
      },
    );
  }
}
