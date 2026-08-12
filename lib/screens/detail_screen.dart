import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../data/repository.dart';
import '../models/room.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/home_map/rating_star.dart';
import 'photo_viewer_screen.dart';

class DetailScreen extends StatefulWidget {
  const DetailScreen({super.key, required this.room});

  final Room room;

  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  Timer? _ticker;
  final PageController _photoController = PageController();
  int _photoPageIndex = 0;

  bool get _checkedIn => RoomRepository.instance.isCheckedIn(widget.room.id);

  @override
  void initState() {
    super.initState();
    if (_checkedIn) _startTicker();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    _photoController.dispose();
    super.dispose();
  }

  void _openPhotoViewer(Room room) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PhotoViewerScreen(photos: room.photos, initialIndex: _photoPageIndex),
      ),
    );
  }

  void _startTicker() {
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      if (!_checkedIn) _ticker?.cancel();
      setState(() {});
    });
  }

  void _toggleCheckIn() {
    if (_checkedIn) {
      RoomRepository.instance.checkOut(widget.room.id);
      _ticker?.cancel();
    } else {
      RoomRepository.instance.checkIn(widget.room.id);
      _startTicker();
    }
    setState(() {});
  }

  String _formatRemaining(Duration d) {
    final m = d.inMinutes.toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  Future<void> _launchMaps() async {
    final room = widget.room;
    final uri = Uri.parse('geo:${room.position.latitude},${room.position.longitude}?q=${room.position.latitude},${room.position.longitude}(${Uri.encodeComponent(room.name)})');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final room = widget.room;
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: Stack(
        children: [
          Positioned.fill(
            child: ListView(
              padding: const EdgeInsets.only(top: 112, bottom: 160),
              children: [
                _buildPhoto(room),
                _buildInfoCard(room),
                _buildRatingRow(room),
                _buildFacilities(room),
                _buildLatestCondition(),
                _buildReviews(),
              ],
            ),
          ),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                child: Container(
                  height: 112,
                  padding: EdgeInsets.only(top: MediaQuery.paddingOf(context).top, bottom: 8),
                  decoration: const BoxDecoration(
                    color: Color(0xEBEBEBEB),
                    border: Border(bottom: BorderSide(color: AppColors.divider)),
                  ),
                  child: Row(
                    children: [
                      const SizedBox(width: 14),
                      _CircleButton(icon: Icons.arrow_back_rounded, onTap: () => Navigator.pop(context)),
                      Expanded(
                        child: Text(
                          'Detail Ruang Laktasi',
                          textAlign: TextAlign.center,
                          style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800),
                        ),
                      ),
                      _CircleButton(icon: Icons.ios_share_rounded, onTap: () {}),
                      const SizedBox(width: 14),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.fromLTRB(14, 12, 14, MediaQuery.paddingOf(context).bottom + 12),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(top: BorderSide(color: AppColors.divider)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: room.isOpen ? _toggleCheckIn : null,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: BorderSide(
                          color: !room.isOpen
                              ? AppColors.disabledFill
                              : (_checkedIn ? AppColors.secondary : AppColors.primary),
                          width: 2,
                        ),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _checkedIn ? Icons.logout_rounded : Icons.camera_alt_outlined,
                            color: !room.isOpen
                                ? AppColors.textFaint
                                : (_checkedIn ? AppColors.sageDk : AppColors.primaryPressed),
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _checkedIn
                                ? 'Check-Out · ${_formatRemaining(RoomRepository.instance.checkInRemaining(room.id) ?? Duration.zero)}'
                                : 'Check-In',
                            style: AppTypography.nunito(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: !room.isOpen
                                  ? AppColors.textFaint
                                  : (_checkedIn ? AppColors.sageDk : AppColors.primaryPressed),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: room.isOpen ? [
                          const BoxShadow(color: Color(0x6BD88B7C), offset: Offset(0, 10), blurRadius: 22)
                        ] : [],
                        gradient: room.isOpen ? const LinearGradient(
                          colors: [AppColors.primary, AppColors.primaryPressed],
                        ) : null,
                        color: room.isOpen ? null : AppColors.disabledFill,
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: room.isOpen ? _launchMaps : null,
                          borderRadius: BorderRadius.circular(24),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.send_rounded, color: room.isOpen ? Colors.white : AppColors.textFaint, size: 20),
                                const SizedBox(width: 8),
                                Text(
                                  'Navigasi',
                                  style: AppTypography.nunito(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: room.isOpen ? Colors.white : AppColors.textFaint,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPhoto(Room room) {
    final checkedIn = _checkedIn;
    final hasPhotos = room.photos.isNotEmpty;
    return Container(
      height: 220,
      width: double.infinity,
      color: AppColors.surfaceSand,
      child: Stack(
        children: [
          if (hasPhotos)
            Positioned.fill(
              child: GestureDetector(
                onTap: () => _openPhotoViewer(room),
                child: PageView.builder(
                  controller: _photoController,
                  itemCount: room.photos.length,
                  onPageChanged: (i) => setState(() => _photoPageIndex = i),
                  itemBuilder: (context, i) => Image.asset(room.photos[i], fit: BoxFit.cover),
                ),
              ),
            )
          else
            Positioned.fill(child: CustomPaint(painter: _IllustrationPainter())),
          if (!room.isOpen)
            Positioned.fill(child: Container(color: const Color(0x523C3727))),
          Positioned(
            left: 16,
            bottom: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(999)),
              child: Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: !room.isOpen
                          ? AppColors.textFaint
                          : (checkedIn ? AppColors.primaryPressed : AppColors.secondary),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    !room.isOpen ? 'Tutup' : (checkedIn ? 'Sedang digunakan' : 'Buka sekarang'),
                    style: AppTypography.quicksand(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: !room.isOpen
                          ? AppColors.body
                          : (checkedIn ? AppColors.primaryPressed : AppColors.secondary),
                    ),
                  )
                ],
              ),
            ),
          ),
          if (hasPhotos)
            Positioned(
              right: 16,
              bottom: 16,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    color: const Color(0xA6333727),
                    child: Row(
                      children: [
                        const Icon(Icons.camera_alt, color: Colors.white, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          '${_photoPageIndex + 1} / ${room.photos.length}',
                          style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(Room room) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 20, 18, 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(room.name, style: AppTypography.nunito(fontSize: 22, fontWeight: FontWeight.w800, letterSpacing: -0.3)),
          const SizedBox(height: 12),
          _InfoRow(icon: Icons.location_on, text: 'Jl. M.H. Thamrin No.28–30, Jakarta Pusat'),
          const SizedBox(height: 8),
          _InfoRow(icon: Icons.directions_walk, text: '${room.distanceLabel} dari lokasimu'),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.access_time, color: AppColors.primary, size: 16),
              const SizedBox(width: 8),
              Text(
                '10.00 – 22.00 WIB',
                style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: room.isOpen ? AppColors.secondary : AppColors.body),
              ),
              if (!room.isOpen) ...[
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: AppColors.primaryTint, borderRadius: BorderRadius.circular(999)),
                  child: Text('Buka pukul 08.00 besok', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primaryPressed)),
                )
              ]
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRatingRow(Room room) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(16)),
        child: Row(
          children: [
            for (int i = 1; i <= 5; i++)
              if (room.rating >= i)
                const RatingStar(size: 16)
              else if (room.rating >= i - 0.5)
                const RatingStar(size: 16, half: true)
              else
                const RatingStar(size: 16, empty: true),
            const SizedBox(width: 8),
            Text(room.rating.toStringAsFixed(1), style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
            const SizedBox(width: 8),
            Text('${room.reviewCount} ulasan', style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
            const Spacer(),
            Text('Lihat semua', style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primaryPressed)),
            const SizedBox(width: 4),
            const Icon(Icons.chevron_right, color: AppColors.primaryPressed, size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildFacilities(Room room) {
    final allFacilities = ['Bersih', 'Kulkas', 'AC', 'Stroller', 'Wastafel', 'Stopkontak', 'Privasi'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text('Fasilitas', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
        ),
        SizedBox(
          height: 36,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: allFacilities.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final fac = allFacilities[index];
              final isAvailable = room.facilities.contains(fac);
              final isForceUnavailable = !room.isOpen && (fac == 'Kulkas' || fac == 'Stopkontak');
              if (isForceUnavailable) {
                return _FacilityTag(label: fac, state: _FacilityState.unavailable);
              } else if (isAvailable) {
                return _FacilityTag(label: fac, state: _FacilityState.available);
              } else {
                return _FacilityTag(label: fac, state: _FacilityState.unverified);
              }
            },
          ),
        ),
      ],
    );
  }

  Widget _buildLatestCondition() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Laporan kondisi terkini', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.primary),
                      alignment: Alignment.center,
                      child: Text('R', style: AppTypography.nunito(fontSize: 20, color: Colors.white, fontWeight: FontWeight.w800)),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Rina D.', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                        Text('2 jam lalu · 3 laporan', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
                      ],
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                      decoration: BoxDecoration(color: AppColors.sageTint, borderRadius: BorderRadius.circular(4)),
                      child: Text('TERVERIFIKASI', style: AppTypography.mono(fontSize: 9.5, fontWeight: FontWeight.w600, color: AppColors.sageDk)),
                    )
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _ConditionChip(label: 'Bersih', isPositive: true),
                    const SizedBox(width: 8),
                    _ConditionChip(label: 'Wastafel berfungsi', isPositive: true),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Container(width: 64, height: 48, decoration: BoxDecoration(color: AppColors.dividerStrong, borderRadius: BorderRadius.circular(8))),
                    const SizedBox(width: 8),
                    Container(width: 64, height: 48, decoration: BoxDecoration(color: AppColors.dividerStrong, borderRadius: BorderRadius.circular(8))),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviews() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Ulasan pengguna', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.amber),
                      alignment: Alignment.center,
                      child: Text('S', style: AppTypography.nunito(fontSize: 20, color: Colors.white, fontWeight: FontWeight.w800)),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Siska', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                        Row(
                          children: [
                            for (int i = 0; i < 5; i++) const RatingStar(size: 10),
                            const SizedBox(width: 4),
                            Text('· 1 minggu lalu', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  '"Ruangannya bersih dan cukup luas untuk bawa stroller. AC-nya dingin, air wastafel juga lancar."',
                  style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.ink),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 16),
        const SizedBox(width: 8),
        Text(text, style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.body)),
      ],
    );
  }
}

class _CircleButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _CircleButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.5)),
        child: Icon(icon, size: 20, color: AppColors.ink),
      ),
    );
  }
}

enum _FacilityState { available, unavailable, unverified }

class _FacilityTag extends StatelessWidget {
  final String label;
  final _FacilityState state;
  const _FacilityTag({required this.label, required this.state});

  @override
  Widget build(BuildContext context) {
    Color bg, border, text;
    IconData icon;
    switch (state) {
      case _FacilityState.available:
        bg = AppColors.sageTint;
        border = AppColors.secondary.withValues(alpha: 0.3);
        text = AppColors.sageDk;
        icon = Icons.check;
        break;
      case _FacilityState.unavailable:
        bg = const Color(0x0D3C281E);
        border = const Color(0x143C281E);
        text = const Color(0xFFA8A096);
        icon = Icons.close;
        break;
      case _FacilityState.unverified:
        bg = Colors.white;
        border = const Color(0x2E3C281E);
        text = const Color(0xFF8A7268);
        icon = Icons.circle_outlined;
        break;
    }

    return Container(
      padding: const EdgeInsets.fromLTRB(10, 6, 12, 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: state == _FacilityState.unverified ? null : Border.all(color: border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: text),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: text)
                .copyWith(decoration: state == _FacilityState.unavailable ? TextDecoration.lineThrough : null),
          ),
        ],
      ),
    );
  }
}

class _ConditionChip extends StatelessWidget {
  final String label;
  final bool isPositive;
  const _ConditionChip({required this.label, required this.isPositive});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: isPositive ? AppColors.sageTint : AppColors.primaryTint,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        label,
        style: AppTypography.quicksand(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: isPositive ? const Color(0xFF5C7A5C) : AppColors.primaryDeep,
        ),
      ),
    );
  }
}

class _IllustrationPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final bgPaint = Paint()..shader = const LinearGradient(colors: [Color(0xFFFBF6F1), Color(0xFFF2C6B8)]).createShader(Offset.zero & size);
    canvas.drawRect(Offset.zero & size, bgPaint);
    final chairPaint = Paint()..color = AppColors.primaryPressed;
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(size.width / 2 - 40, size.height - 100, 80, 80), const Radius.circular(16)), chairPaint);
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
