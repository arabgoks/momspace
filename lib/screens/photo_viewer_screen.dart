import 'package:flutter/material.dart';

import '../theme/app_typography.dart';

/// Full-screen, swipeable, pinch-to-zoom viewer for a room's facility
/// photos. Pushed from [DetailScreen] when the photo header is tapped.
class PhotoViewerScreen extends StatefulWidget {
  const PhotoViewerScreen({super.key, required this.photos, this.initialIndex = 0});

  final List<String> photos;
  final int initialIndex;

  @override
  State<PhotoViewerScreen> createState() => _PhotoViewerScreenState();
}

class _PhotoViewerScreenState extends State<PhotoViewerScreen> {
  late final PageController _controller = PageController(initialPage: widget.initialIndex);
  late int _index = widget.initialIndex;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          Positioned.fill(
            child: PageView.builder(
              controller: _controller,
              itemCount: widget.photos.length,
              onPageChanged: (i) => setState(() => _index = i),
              itemBuilder: (context, i) {
                return InteractiveViewer(
                  minScale: 1,
                  maxScale: 4,
                  child: Center(
                    child: Image.asset(widget.photos[i], fit: BoxFit.contain),
                  ),
                );
              },
            ),
          ),
          Positioned(
            top: MediaQuery.paddingOf(context).top + 8,
            left: 14,
            child: _CircleButton(
              icon: Icons.close_rounded,
              onTap: () => Navigator.pop(context),
            ),
          ),
          if (widget.photos.length > 1)
            Positioned(
              top: MediaQuery.paddingOf(context).top + 16,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xA6333727),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '${_index + 1} / ${widget.photos.length}',
                    style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _CircleButton extends StatelessWidget {
  const _CircleButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      customBorder: const CircleBorder(),
      child: Container(
        width: 38,
        height: 38,
        decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xA6333727)),
        child: Icon(icon, size: 20, color: Colors.white),
      ),
    );
  }
}
