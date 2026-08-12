# MomSpace App Completion (Check-In, Search, Profile, Login) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining proposal-promised features of the MomSpace Flutter app — a real Check-In interaction, a functional Search tab, and a Profile tab with a Login/Guest-mode screen — frontend-only, no backend.

**Architecture:** Extends `RoomRepository` (already SharedPreferences-backed per the prerequisite plan below) with in-memory check-in state. Adds three new full screens (`SearchScreen`, `ProfileScreen`, `LoginScreen`) wired into `RootShell`'s existing tab scaffolding. Promotes a private widget (`_NearbyRoomCard`) to a shared, reusable one used by both the Home Map and Search screen.

**Tech Stack:** Flutter/Dart, no new packages.

## Global Constraints

- **Prerequisite:** `docs/superpowers/plans/2026-08-12-crowdsourcing-forms.md` must be fully implemented first. This plan uses `RoomRepository.instance.{reports,submissions,rewardPoints}` (that plan's Task 2), the `ConditionReport`/`LocationSubmission` models, and the `onRoomSelected` callback on `HomeMapScreen`/`RootShell` (that plan's Task 11).
- No backend/Firebase — all new state is either in-memory (check-ins, session) or reuses the existing SharedPreferences-backed repository.
- Design tokens only (`AppColors`/`AppTypography`/`AppSpacing`/`AppRadius`/`AppShadows`/`AppMotion`) — no new hardcoded hex values unless copied from an existing established pattern.
- Indonesian UI copy throughout, "kamu" voice (matches the majority of existing screens, e.g. `report_hub_sheet.dart`).
- After every task, run `flutter analyze` and fix before proceeding.

---

## File Structure

**New files:**
- `lib/widgets/home_map/nearby_room_card.dart` — promoted from `room_bottom_sheet.dart`'s private `_NearbyRoomCard`
- `lib/screens/search_screen.dart`
- `lib/data/app_session.dart`
- `lib/screens/login_screen.dart`
- `lib/widgets/profile/submission_status_pill.dart`
- `lib/screens/profile_screen.dart`
- `test/data/repository_checkin_test.dart`
- `test/screens/detail_screen_checkin_test.dart`
- `test/screens/search_screen_test.dart`
- `test/screens/login_screen_test.dart`
- `test/screens/profile_screen_test.dart`
- `test/screens/root_shell_navigation_test.dart`

**Modified files:**
- `lib/data/repository.dart` — add check-in state
- `lib/screens/detail_screen.dart` — `StatelessWidget` → `StatefulWidget`, real Check-In/Check-Out
- `lib/widgets/home_map/room_bottom_sheet.dart` — use promoted `NearbyRoomCard`, reflect check-in occupancy
- `lib/screens/home_map_screen.dart` — `ListenableBuilder` wrap, wire `SearchPill`/`FloatingMapActions`
- `lib/screens/root_shell.dart` — swap placeholders for real screens, thread search-tab callback

---

### Task 1: RoomRepository check-in state

**Files:**
- Modify: `lib/data/repository.dart`
- Test: `test/data/repository_checkin_test.dart`

**Interfaces:**
- Produces: `bool isCheckedIn(String roomId)`, `Duration? checkInRemaining(String roomId)`, `void checkIn(String roomId)`, `void checkOut(String roomId)` on `RoomRepository`.

- [ ] **Step 1: Write the failing test**

Create `test/data/repository_checkin_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('checkIn marks a room checked in with ~30 minutes remaining', () async {
    await RoomRepository.instance.init();
    expect(RoomRepository.instance.isCheckedIn('room-1'), isFalse);

    RoomRepository.instance.checkIn('room-1');

    expect(RoomRepository.instance.isCheckedIn('room-1'), isTrue);
    final remaining = RoomRepository.instance.checkInRemaining('room-1');
    expect(remaining, isNotNull);
    expect(remaining!.inMinutes, inInclusiveRange(29, 30));
  });

  test('checkOut clears the checked-in state', () async {
    await RoomRepository.instance.init();
    RoomRepository.instance.checkIn('room-2');
    expect(RoomRepository.instance.isCheckedIn('room-2'), isTrue);

    RoomRepository.instance.checkOut('room-2');

    expect(RoomRepository.instance.isCheckedIn('room-2'), isFalse);
    expect(RoomRepository.instance.checkInRemaining('room-2'), isNull);
  });

  test('checking in one room does not affect another', () async {
    await RoomRepository.instance.init();
    RoomRepository.instance.checkIn('room-3');
    expect(RoomRepository.instance.isCheckedIn('room-4'), isFalse);
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/data/repository_checkin_test.dart`
Expected: FAIL — the four methods don't exist yet.

- [ ] **Step 3: Add check-in state to RoomRepository**

In `lib/data/repository.dart`, insert the following immediately before the closing brace of the `RoomRepository` class (after the existing `_persistPoints()` method):

```dart
  final Map<String, DateTime> _checkIns = {};

  /// Not persisted to SharedPreferences — occupancy is transient/live
  /// (unlike reports/submissions/points), so it resets every app run.
  bool isCheckedIn(String roomId) {
    final expiry = _checkIns[roomId];
    if (expiry == null) return false;
    if (DateTime.now().isAfter(expiry)) {
      _checkIns.remove(roomId);
      return false;
    }
    return true;
  }

  Duration? checkInRemaining(String roomId) {
    final expiry = _checkIns[roomId];
    if (expiry == null) return null;
    final remaining = expiry.difference(DateTime.now());
    return remaining.isNegative ? null : remaining;
  }

  void checkIn(String roomId) {
    _checkIns[roomId] = DateTime.now().add(const Duration(minutes: 30));
    notifyListeners();
  }

  void checkOut(String roomId) {
    _checkIns.remove(roomId);
    notifyListeners();
  }
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `flutter test test/data/repository_checkin_test.dart`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/data/repository.dart test/data/repository_checkin_test.dart
git commit -m "feat: add in-memory check-in state to RoomRepository"
```

---

### Task 2: Detail screen — real Check-In/Check-Out

**Files:**
- Modify: `lib/screens/detail_screen.dart` (full rewrite)
- Test: `test/screens/detail_screen_checkin_test.dart`

**Interfaces:**
- Consumes: `RoomRepository.instance.{isCheckedIn,checkInRemaining,checkIn,checkOut}` (Task 1).
- Produces: `DetailScreen` becomes a `StatefulWidget`; public constructor unchanged (`const DetailScreen({required Room room})`).

- [ ] **Step 1: Write the failing test**

Create `test/screens/detail_screen_checkin_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/data/demo_rooms.dart';
import 'package:momspace/screens/detail_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('tapping Check-In switches the button to a Check-Out countdown', (tester) async {
    await tester.pumpWidget(MaterialApp(home: DetailScreen(room: demoSelectedRoom)));
    await tester.pumpAndSettle();

    expect(find.text('Check-In'), findsOneWidget);
    expect(RoomRepository.instance.isCheckedIn(demoSelectedRoom.id), isFalse);

    await tester.tap(find.text('Check-In'));
    await tester.pump();

    expect(RoomRepository.instance.isCheckedIn(demoSelectedRoom.id), isTrue);
    expect(find.textContaining('Check-Out'), findsOneWidget);

    await tester.tap(find.textContaining('Check-Out'));
    await tester.pump();

    expect(RoomRepository.instance.isCheckedIn(demoSelectedRoom.id), isFalse);
    expect(find.text('Check-In'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/screens/detail_screen_checkin_test.dart`
Expected: FAIL — `DetailScreen`'s Check-In button currently has `onPressed: () {}` and never changes label.

- [ ] **Step 3: Rewrite the screen**

Replace the full contents of `lib/screens/detail_screen.dart`:

```dart
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

class DetailScreen extends StatefulWidget {
  const DetailScreen({super.key, required this.room});

  final Room room;

  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  Timer? _ticker;

  bool get _checkedIn => RoomRepository.instance.isCheckedIn(widget.room.id);

  @override
  void initState() {
    super.initState();
    if (_checkedIn) _startTicker();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
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
    return Container(
      height: 220,
      width: double.infinity,
      color: AppColors.surfaceSand,
      child: Stack(
        children: [
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
                      Text('1 / 4', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
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
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `flutter test test/screens/detail_screen_checkin_test.dart`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/screens/detail_screen.dart test/screens/detail_screen_checkin_test.dart
git commit -m "feat: make the Detail screen Check-In button real"
```

---

### Task 3: Promote NearbyRoomCard + reflect check-in occupancy in the bottom sheet

**Files:**
- Create: `lib/widgets/home_map/nearby_room_card.dart`
- Modify: `lib/widgets/home_map/room_bottom_sheet.dart`

**Interfaces:**
- Consumes: `RoomRepository.instance.isCheckedIn` (Task 1).
- Produces: `class NearbyRoomCard extends StatelessWidget { const NearbyRoomCard({required Room room, VoidCallback? onTap}) }` — public, no fixed width (callers wrap in `SizedBox`). Consumed by Task 5's `SearchScreen`.

- [ ] **Step 1: Create the promoted widget**

Create `lib/widgets/home_map/nearby_room_card.dart`:

```dart
import 'package:flutter/material.dart';

import '../../models/room.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'rating_star.dart';

/// A compact room summary card — avatar, name, distance/floor, rating,
/// open/closed badge. Used by the Home/Map empty-sheet horizontal list and
/// the Search screen's vertical results list.
/// Source: home-map.jsx `NearbyCard` (previously private `_NearbyRoomCard`
/// in room_bottom_sheet.dart).
class NearbyRoomCard extends StatelessWidget {
  const NearbyRoomCard({super.key, required this.room, this.onTap});

  final Room room;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.s12),
        decoration: BoxDecoration(
          color: AppColors.surfaceSand,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.divider),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 36,
              height: 36,
              margin: const EdgeInsets.only(bottom: AppSpacing.s8),
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.all(Radius.circular(10)),
                gradient: LinearGradient(
                  begin: Alignment(-0.7, -1),
                  end: Alignment(0.7, 1),
                  colors: [AppColors.primary, AppColors.rose03],
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                room.avatarInitial,
                style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white),
              ),
            ),
            Text(
              room.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800, height: 1.25),
            ),
            const SizedBox(height: 2),
            Text(
              '${room.distanceLabel} · ${room.floorLabel}',
              style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, height: 1.2, color: AppColors.body),
            ),
            const SizedBox(height: AppSpacing.s6),
            Row(
              children: [
                for (int i = 1; i <= 5; i++)
                  if (room.rating >= i)
                    const RatingStar(size: 10)
                  else if (room.rating >= i - 0.5)
                    const RatingStar(size: 10, half: true)
                  else
                    const RatingStar(size: 10, empty: true),
                const SizedBox(width: AppSpacing.s4),
                Text(
                  room.rating.toStringAsFixed(1),
                  style: AppTypography.nunito(fontSize: 11, fontWeight: FontWeight.w600, height: 1.2, color: AppColors.ink),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: room.isOpen ? AppColors.sageTint : AppColors.disabledFill,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    room.isOpen ? 'BUKA' : 'TUTUP',
                    style: AppTypography.quicksand(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w700,
                      height: 1.2,
                      color: room.isOpen ? AppColors.sageDk : AppColors.body,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Update `room_bottom_sheet.dart`**

In `lib/widgets/home_map/room_bottom_sheet.dart`:

1. Add imports at the top:
```dart
import '../../data/repository.dart';
import 'nearby_room_card.dart';
```

2. In `SheetDefault`'s meta row (the `Row` containing the sage/gray status dot and "Buka sekarang"/"Tutup" text), replace that `Container` + `Text` pair with:

```dart
                              Container(
                                width: 7,
                                height: 7,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: !room.isOpen
                                      ? AppColors.textFaint
                                      : (RoomRepository.instance.isCheckedIn(room.id) ? AppColors.primaryPressed : AppColors.secondary),
                                  boxShadow: room.isOpen ? [
                                    BoxShadow(
                                      color: (RoomRepository.instance.isCheckedIn(room.id) ? AppColors.primaryPressed : AppColors.secondary).withValues(alpha: 0.2),
                                      spreadRadius: 3,
                                    ),
                                  ] : null,
                                ),
                              ),
                              const SizedBox(width: 5),
                              Text(
                                !room.isOpen
                                    ? 'Tutup'
                                    : (RoomRepository.instance.isCheckedIn(room.id) ? 'Sedang digunakan' : 'Buka sekarang'),
                                style: AppTypography.quicksand(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w700,
                                  color: !room.isOpen
                                      ? AppColors.body
                                      : (RoomRepository.instance.isCheckedIn(room.id) ? AppColors.primaryPressed : AppColors.secondary),
                                ),
                              ),
```

3. Delete the entire private `_NearbyRoomCard` class at the bottom of the file (the class starting `class _NearbyRoomCard extends StatelessWidget { ... }`).

4. In `SheetEmpty`'s `itemBuilder`, replace:
```dart
              itemBuilder: (context, index) => _NearbyRoomCard(room: rooms[index]),
```
with:
```dart
              itemBuilder: (context, index) => SizedBox(
                width: 180,
                child: NearbyRoomCard(
                  room: rooms[index],
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DetailScreen(room: rooms[index]))),
                ),
              ),
```

(This also fixes a pre-existing gap: tapping a nearby-room card in the empty-sheet horizontal list previously did nothing.)

- [ ] **Step 3: Run analyzer**

Run: `flutter analyze`
Expected: No new errors (confirms the deleted `_NearbyRoomCard` had no other references).

- [ ] **Step 4: Commit**

```bash
git add lib/widgets/home_map/nearby_room_card.dart lib/widgets/home_map/room_bottom_sheet.dart
git commit -m "refactor: promote NearbyRoomCard to a shared widget, reflect check-in occupancy"
```

---

### Task 4: Wire Home Map's SearchPill, layers button, and live check-in updates

**Files:**
- Modify: `lib/screens/home_map_screen.dart` (full rewrite)

**Interfaces:**
- Consumes: `RoomRepository.instance` (Task 1), `SearchPill(onTap, onFilterTap)` and `FloatingMapActions(onLayersTap, onLocateTap)` (both already accept these callbacks — no changes needed to those two widget files).
- Produces: `HomeMapScreen({Room? Function? onRoomSelected, VoidCallback? onSearchTap})` — the new `onSearchTap` param is consumed by Task 8's `RootShell`.

- [ ] **Step 1: Rewrite the screen**

Replace the full contents of `lib/screens/home_map_screen.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:geolocator/geolocator.dart';

import '../data/demo_rooms.dart';
import '../data/repository.dart';
import '../models/room.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../utils/map_marker_utils.dart';
import '../widgets/home_map/floating_map_actions.dart';
import '../widgets/home_map/map_pin.dart';
import '../widgets/home_map/room_bottom_sheet.dart';
import '../widgets/home_map/search_pill.dart';
import '../widgets/home_map/user_location_dot.dart';
import '../widgets/home_map/warm_map_background.dart';
import '../widgets/nav/classic_pill_navbar.dart';

class HomeMapScreen extends StatefulWidget {
  const HomeMapScreen({super.key, this.onRoomSelected, this.onSearchTap});

  final ValueChanged<Room?>? onRoomSelected;
  final VoidCallback? onSearchTap;

  @override
  State<HomeMapScreen> createState() => _HomeMapScreenState();
}

class _HomeMapScreenState extends State<HomeMapScreen> {
  String? _selectedRoomId;
  bool _loadingSelection = false;

  MapLibreMapController? _mapController;
  bool _mapStyleLoaded = false;
  bool _mapError = false;
  LatLng? _userLocation;

  SheetVariant get _sheetVariant {
    if (_loadingSelection) return SheetVariant.loading;
    return _selectedRoomId == null ? SheetVariant.empty : SheetVariant.defaultRoom;
  }

  Room? get _selectedRoom {
    if (_selectedRoomId == null) return null;
    if (demoSelectedRoom.id == _selectedRoomId) return demoSelectedRoom;
    return demoNearbyRooms.firstWhere((r) => r.id == _selectedRoomId, orElse: () => demoSelectedRoom);
  }

  Future<void> _selectRoom(String id) async {
    setState(() => _loadingSelection = true);
    await Future<void>.delayed(const Duration(milliseconds: 450));
    if (!mounted) return;
    setState(() {
      _selectedRoomId = id;
      _loadingSelection = false;
    });
    _updateSymbols();
    widget.onRoomSelected?.call(_selectedRoom);
  }

  Future<void> _loadMarkerImages() async {
    if (_mapController == null) return;
    try {
      final availablePng = await rasterizeWidget(const MapPin(state: PinState.available), context: context, logicalSize: const Size(28, 36));
      final selectedPng = await rasterizeWidget(const MapPin(state: PinState.selected), context: context, logicalSize: const Size(38, 48));
      final closedPng = await rasterizeWidget(const MapPin(state: PinState.closed), context: context, logicalSize: const Size(28, 36));

      await _mapController!.addImage('pin-available', availablePng);
      await _mapController!.addImage('pin-selected', selectedPng);
      await _mapController!.addImage('pin-closed', closedPng);

      _updateSymbols();
    } catch (e) {
      debugPrint("Error loading marker images: \$e");
    }
  }

  void _updateSymbols() {
    if (_mapController == null || !_mapStyleLoaded) return;
    _mapController!.clearSymbols();

    final rooms = [demoSelectedRoom, ...demoNearbyRooms];

    for (var room in rooms) {
      String iconImage = room.isOpen ? 'pin-available' : 'pin-closed';
      if (_selectedRoomId == room.id) {
        iconImage = 'pin-selected';
      }

      _mapController!.addSymbol(
        SymbolOptions(
          geometry: room.position,
          iconImage: iconImage,
          iconAnchor: 'bottom',
        ),
        {'roomId': room.id}
      );
    }
  }

  Future<void> _locateUser() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Layanan lokasi tidak aktif.')));
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Izin lokasi ditolak.')));
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Izin lokasi ditolak permanen.')));
      return;
    }

    final position = await Geolocator.getCurrentPosition();
    setState(() {
      _userLocation = LatLng(position.latitude, position.longitude);
    });

    _mapController?.animateCamera(CameraUpdate.newCameraPosition(
      CameraPosition(target: _userLocation!, zoom: 15, tilt: 35)
    ));
  }

  void _showLegend() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          left: 16, right: 16, top: 16,
          bottom: MediaQuery.paddingOf(context).bottom + 16,
        ),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppRadius.cardLg),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Legenda Peta', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
              const SizedBox(height: 14),
              _legendRow(AppColors.primary, 'Ruang laktasi tersedia'),
              const SizedBox(height: 10),
              _legendRow(AppColors.primaryPressed, 'Sedang dipilih'),
              const SizedBox(height: 10),
              _legendRow(AppColors.pinClosed, 'Tutup / tidak tersedia'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _legendRow(Color color, String label) {
    return Row(
      children: [
        Container(width: 14, height: 14, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 10),
        Text(label, style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.body)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.paddingOf(context).top;
    final searchTop = topInset + 12;
    final variant = _sheetVariant;
    final sheetHeight = RoomBottomSheet.heightFor(variant);
    final actionsBottom = sheetHeight + 98;

    final room = _selectedRoom;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent),
      child: Scaffold(
        backgroundColor: AppColors.mapLand,
        body: Stack(
          children: [
            if (_mapError || !_mapStyleLoaded)
              const Positioned.fill(child: WarmMapBackground()),

            Positioned.fill(
              child: MapLibreMap(
                initialCameraPosition: const CameraPosition(
                  target: LatLng(-6.1935, 106.8230),
                  zoom: 15,
                  tilt: 35,
                ),
                styleString: 'assets/map_style_momspace.json',
                myLocationEnabled: false,
                compassEnabled: false,
                rotateGesturesEnabled: true,
                onMapCreated: (controller) {
                  _mapController = controller;
                  controller.onSymbolTapped.add((symbol) {
                    final roomId = symbol.data?['roomId'] as String?;
                    if (roomId != null) {
                      _selectRoom(roomId);
                    }
                  });
                },
                onStyleLoadedCallback: () {
                  setState(() => _mapStyleLoaded = true);
                  _loadMarkerImages();
                },
              ),
            ),

            if (_userLocation != null) const SizedBox.shrink(),

            Positioned(
              top: searchTop,
              left: 14,
              right: 14,
              child: SearchPill(
                onTap: widget.onSearchTap,
                onFilterTap: widget.onSearchTap,
              ),
            ),
            Positioned(
              right: 14,
              bottom: actionsBottom,
              child: FloatingMapActions(
                onLayersTap: _showLegend,
                onLocateTap: _locateUser,
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 88,
              child: ListenableBuilder(
                listenable: RoomRepository.instance,
                builder: (context, _) => RoomBottomSheet(
                  variant: variant,
                  selectedRoom: room ?? demoSelectedRoom,
                  nearbyRooms: demoNearbyRooms,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Run analyzer**

Run: `flutter analyze`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add lib/screens/home_map_screen.dart
git commit -m "feat: wire Home Map search pill and layers legend, live check-in updates"
```

---

### Task 5: Search screen

**Files:**
- Create: `lib/screens/search_screen.dart`
- Test: `test/screens/search_screen_test.dart`

**Interfaces:**
- Consumes: `NearbyRoomCard` (Task 3), `demoSelectedRoom`/`demoNearbyRooms` (existing `lib/data/demo_rooms.dart`), `DetailScreen` (existing).
- Produces: `class SearchScreen extends StatefulWidget { const SearchScreen() }`. Consumed by Task 8's `RootShell`.

No pixel mockup exists for a dedicated Search screen in `design_handoff_momspace/` (the Home Map's `SearchPill` is decorative-only there) — this screen is authored fresh from the existing token system.

- [ ] **Step 1: Write the failing test**

Create `test/screens/search_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:momspace/screens/search_screen.dart';

void main() {
  testWidgets('typing a query filters the results list', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SearchScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Grand Indonesia'), findsOneWidget);
    expect(find.text('Sarinah'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'Sarinah');
    await tester.pumpAndSettle();

    expect(find.text('Sarinah'), findsOneWidget);
    expect(find.text('Grand Indonesia'), findsNothing);
  });

  testWidgets('the "Buka sekarang" filter hides closed rooms', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SearchScreen()));
    await tester.pumpAndSettle();

    // Sarinah is closed in the demo dataset (lib/data/demo_rooms.dart).
    expect(find.text('Sarinah'), findsOneWidget);

    await tester.tap(find.text('Buka sekarang'));
    await tester.pumpAndSettle();

    expect(find.text('Sarinah'), findsNothing);
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/screens/search_screen_test.dart`
Expected: FAIL — `lib/screens/search_screen.dart` doesn't exist yet.

- [ ] **Step 3: Create the screen**

Create `lib/screens/search_screen.dart`:

```dart
import 'package:flutter/material.dart';

import '../data/demo_rooms.dart';
import '../models/room.dart';
import 'detail_screen.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/home_map/nearby_room_card.dart';

enum _SortBy { distance, rating }

/// Real search/filter over the demo room dataset. No pixel mockup exists
/// for a dedicated Search screen in design_handoff_momspace/ — styled from
/// the existing token system, reusing [NearbyRoomCard].
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  static const _facilityOptions = ['Bersih', 'Kulkas', 'AC', 'Stroller', 'Wastafel', 'Stopkontak', 'Privasi'];

  final _queryController = TextEditingController();
  final Set<String> _selectedFacilities = {};
  bool _openOnly = false;
  _SortBy _sortBy = _SortBy.distance;

  List<Room> get _allRooms => const [demoSelectedRoom, ...demoNearbyRooms];

  List<Room> get _results {
    final query = _queryController.text.trim().toLowerCase();
    final rooms = _allRooms.where((room) {
      final matchesQuery = query.isEmpty || room.name.toLowerCase().contains(query);
      final matchesFacilities = _selectedFacilities.every(room.facilities.contains);
      final matchesOpen = !_openOnly || room.isOpen;
      return matchesQuery && matchesFacilities && matchesOpen;
    }).toList();

    rooms.sort((a, b) => switch (_sortBy) {
          _SortBy.distance => a.distanceMeters.compareTo(b.distanceMeters),
          _SortBy.rating => b.rating.compareTo(a.rating),
        });
    return rooms;
  }

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final results = _results;
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.s18, AppSpacing.s18, AppSpacing.s18, AppSpacing.s12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Pencarian', style: AppTypography.screenTitle),
                  const SizedBox(height: 14),
                  _buildSearchField(),
                  const SizedBox(height: 12),
                  _buildFilterRow(),
                ],
              ),
            ),
            Expanded(
              child: results.isEmpty
                  ? _buildEmptyState()
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(AppSpacing.s18, 0, AppSpacing.s18, 88 + AppSpacing.s24),
                      itemCount: results.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final room = results[index];
                        return NearbyRoomCard(
                          room: room,
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DetailScreen(room: room))),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchField() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(25),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          const Icon(Icons.search, color: AppColors.primaryPressed, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: TextField(
              controller: _queryController,
              onChanged: (_) => setState(() {}),
              style: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.ink),
              decoration: InputDecoration(
                hintText: 'Cari ruang laktasi terdekat...',
                hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: const Color(0xFFA68A82)),
                border: InputBorder.none,
                isDense: true,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterRow() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          ChoiceChip(
            label: const Text('Buka sekarang'),
            selected: _openOnly,
            onSelected: (v) => setState(() => _openOnly = v),
            labelStyle: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: _openOnly ? Colors.white : AppColors.body),
            selectedColor: AppColors.secondary,
            backgroundColor: AppColors.surfaceSand,
            side: BorderSide.none,
          ),
          const SizedBox(width: 8),
          ChoiceChip(
            label: const Text('Terdekat'),
            selected: _sortBy == _SortBy.distance,
            onSelected: (_) => setState(() => _sortBy = _SortBy.distance),
            labelStyle: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: _sortBy == _SortBy.distance ? Colors.white : AppColors.body),
            selectedColor: AppColors.primary,
            backgroundColor: AppColors.surfaceSand,
            side: BorderSide.none,
          ),
          const SizedBox(width: 8),
          ChoiceChip(
            label: const Text('Rating tertinggi'),
            selected: _sortBy == _SortBy.rating,
            onSelected: (_) => setState(() => _sortBy = _SortBy.rating),
            labelStyle: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: _sortBy == _SortBy.rating ? Colors.white : AppColors.body),
            selectedColor: AppColors.primary,
            backgroundColor: AppColors.surfaceSand,
            side: BorderSide.none,
          ),
          const SizedBox(width: 8),
          for (final facility in _facilityOptions) ...[
            ChoiceChip(
              label: Text(facility),
              selected: _selectedFacilities.contains(facility),
              onSelected: (v) => setState(() {
                if (v) {
                  _selectedFacilities.add(facility);
                } else {
                  _selectedFacilities.remove(facility);
                }
              }),
              labelStyle: AppTypography.quicksand(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: _selectedFacilities.contains(facility) ? Colors.white : AppColors.body,
              ),
              selectedColor: AppColors.sageDk,
              backgroundColor: AppColors.surfaceSand,
              side: BorderSide.none,
            ),
            const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.s24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.search_off_rounded, size: 48, color: AppColors.disabledFill),
            const SizedBox(height: 12),
            Text(
              'Tidak ada ruang laktasi yang cocok dengan pencarianmu.',
              textAlign: TextAlign.center,
              style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textFaint),
            ),
          ],
        ),
      ),
    );
  }
}
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `flutter test test/screens/search_screen_test.dart`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/screens/search_screen.dart test/screens/search_screen_test.dart
git commit -m "feat: add functional Search screen with filter/sort"
```

---

### Task 6: AppSession + Login/Guest-mode screen

**Files:**
- Create: `lib/data/app_session.dart`
- Create: `lib/screens/login_screen.dart`
- Test: `test/screens/login_screen_test.dart`

**Interfaces:**
- Produces: `class AppSession extends ChangeNotifier { static final AppSession instance; String? get displayLabel; void logIn(String label); void logOut(); }` and `class LoginScreen extends StatelessWidget/StatefulWidget { const LoginScreen() }`, pushed via `Navigator.push` and popped on submit/guest. Consumed by Task 7's `ProfileScreen`.

No pixel mockup exists for a login screen in `design_handoff_momspace/` (all 7 mockups assume an already-authenticated user) — this screen is authored fresh from the existing token system. There is no backend: "Masuk" performs local-only validation and sets `AppSession`; it never calls an auth service.

- [ ] **Step 1: Write the failing test**

Create `test/screens/login_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:momspace/data/app_session.dart';
import 'package:momspace/screens/login_screen.dart';

void main() {
  setUp(() {
    AppSession.instance.logOut();
  });

  testWidgets('submitting a valid email and password logs in and pops', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: Builder(
        builder: (context) => Scaffold(
          body: Center(
            child: ElevatedButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen())),
              child: const Text('open'),
            ),
          ),
        ),
      ),
    ));
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('loginEmailField')), 'ibu@momspace.id');
    await tester.enterText(find.byKey(const Key('loginPasswordField')), 'rahasia');
    await tester.tap(find.text('Masuk'));
    await tester.pumpAndSettle();

    expect(AppSession.instance.displayLabel, 'ibu@momspace.id');
    expect(find.byType(LoginScreen), findsNothing);
  });

  testWidgets('an invalid password shows a local validation error and does not log in', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('loginEmailField')), 'ibu@momspace.id');
    await tester.enterText(find.byKey(const Key('loginPasswordField')), 'abc');
    await tester.tap(find.text('Masuk'));
    await tester.pump();

    expect(AppSession.instance.displayLabel, isNull);
    expect(find.textContaining('Masukkan email valid'), findsOneWidget);
  });

  testWidgets('Lanjutkan sebagai Tamu pops without setting a session', (tester) async {
    await tester.pumpWidget(MaterialApp(
      home: Builder(
        builder: (context) => Scaffold(
          body: Center(
            child: ElevatedButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen())),
              child: const Text('open'),
            ),
          ),
        ),
      ),
    ));
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Lanjutkan sebagai Tamu'));
    await tester.pumpAndSettle();

    expect(AppSession.instance.displayLabel, isNull);
    expect(find.byType(LoginScreen), findsNothing);
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/screens/login_screen_test.dart`
Expected: FAIL — neither file exists yet.

- [ ] **Step 3: Create AppSession**

Create `lib/data/app_session.dart`:

```dart
import 'package:flutter/foundation.dart';

/// Minimal, in-memory-only session concept — there is no backend auth in
/// this build, so nothing here is persisted; it resets every app run.
/// `displayLabel == null` means guest mode (the default).
class AppSession extends ChangeNotifier {
  static final AppSession instance = AppSession._internal();
  AppSession._internal();

  String? _displayLabel;
  String? get displayLabel => _displayLabel;

  void logIn(String label) {
    _displayLabel = label;
    notifyListeners();
  }

  void logOut() {
    _displayLabel = null;
    notifyListeners();
  }
}
```

- [ ] **Step 4: Create the Login screen**

Create `lib/screens/login_screen.dart`:

```dart
import 'package:flutter/material.dart';

import '../data/app_session.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

/// Simple, fresh-designed login/guest-mode screen — no pixel mockup exists
/// for this in design_handoff_momspace/. There is no backend: "Masuk"
/// performs local-only validation and sets [AppSession].
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String? _error;

  bool get _canSubmit =>
      _emailController.text.contains('@') && _passwordController.text.length >= 6;

  void _submit() {
    if (!_canSubmit) {
      setState(() => _error = 'Masukkan email valid dan kata sandi minimal 6 karakter.');
      return;
    }
    AppSession.instance.logIn(_emailController.text.trim());
    Navigator.pop(context);
  }

  void _continueAsGuest() => Navigator.pop(context);

  void _showRegisterUnavailable() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Registrasi belum tersedia di versi ini.')),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s24, vertical: AppSpacing.s24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),
              Center(
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: AppColors.primary.withValues(alpha: 0.4), offset: const Offset(0, 10), blurRadius: 22),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Text('M', style: AppTypography.nunito(fontSize: 34, fontWeight: FontWeight.w900, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 16),
              Center(child: Text('MomSpace', style: AppTypography.nunito(fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: -0.3))),
              const SizedBox(height: 6),
              Center(
                child: Text(
                  'Platform ruang laktasi pintar untuk Jakarta',
                  textAlign: TextAlign.center,
                  style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                ),
              ),
              const SizedBox(height: 36),
              Text('Email', style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              TextField(
                key: const Key('loginEmailField'),
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  hintText: 'nama@email.com',
                  hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
                  filled: true,
                  fillColor: AppColors.surfaceSand,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 18),
              Text('Kata Sandi', style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              TextField(
                key: const Key('loginPasswordField'),
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  hintText: 'Minimal 6 karakter',
                  hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
                  filled: true,
                  fillColor: AppColors.surfaceSand,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 10),
                Text(_error!, style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primaryDeep)),
              ],
              const SizedBox(height: 24),
              SizedBox(
                height: 52,
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                    elevation: 0,
                  ),
                  child: Text('Masuk', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  const Expanded(child: Divider(color: AppColors.divider)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text('atau', style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
                  ),
                  const Expanded(child: Divider(color: AppColors.divider)),
                ],
              ),
              const SizedBox(height: 14),
              SizedBox(
                height: 52,
                child: OutlinedButton(
                  onPressed: _continueAsGuest,
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.dividerStrong),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                  ),
                  child: Text('Lanjutkan sebagai Tamu', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.ink)),
                ),
              ),
              const SizedBox(height: 24),
              Center(
                child: GestureDetector(
                  onTap: _showRegisterUnavailable,
                  child: RichText(
                    text: TextSpan(
                      style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                      children: [
                        const TextSpan(text: 'Belum punya akun? '),
                        TextSpan(text: 'Daftar', style: TextStyle(color: AppColors.primaryPressed, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `flutter test test/screens/login_screen_test.dart`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add lib/data/app_session.dart lib/screens/login_screen.dart test/screens/login_screen_test.dart
git commit -m "feat: add AppSession and a Login/Guest-mode screen"
```

---

### Task 7: Profile screen + submission status pill

**Files:**
- Create: `lib/widgets/profile/submission_status_pill.dart`
- Create: `lib/screens/profile_screen.dart`
- Test: `test/screens/profile_screen_test.dart`

**Interfaces:**
- Consumes: `RoomRepository.instance.{reports,submissions,rewardPoints}` (crowdsourcing-forms plan Task 2), `ConditionReport`/`LocationSubmission` models, `AppSession.instance` (Task 6), `LoginScreen` (Task 6).
- Produces: `class SubmissionStatusPill extends StatelessWidget { const SubmissionStatusPill({required SubmissionStatus status}) }`, `class ProfileScreen extends StatefulWidget { const ProfileScreen() }`. Consumed by Task 8's `RootShell`.

No pixel mockup exists for a Profile screen in `design_handoff_momspace/` — authored fresh from the existing token system. The 3-state pill matches the exact spec already documented for submission status in `design_handoff_momspace/README.md` § 5.

- [ ] **Step 1: Write the failing test**

Create `test/screens/profile_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/app_session.dart';
import 'package:momspace/data/repository.dart';
import 'package:momspace/models/condition_report.dart';
import 'package:momspace/screens/profile_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
    AppSession.instance.logOut();
  });

  testWidgets('shows the guest prompt and zero points with no contributions', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Kamu sedang menjelajah sebagai Tamu'), findsOneWidget);
    expect(find.text('0'), findsOneWidget);
    expect(find.text('Belum ada laporan kondisi yang kamu kirim.'), findsOneWidget);
  });

  testWidgets('reflects reward points and report history after a report is added', (tester) async {
    await RoomRepository.instance.addReport(
      ConditionReport(
        id: '1',
        roomId: 'room-1',
        roomName: 'Plaza Indonesia · Level 4',
        conditions: const ['Bersih'],
        timestamp: DateTime.now(),
      ),
    );

    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    expect(find.text('10'), findsOneWidget);
    expect(find.text('Plaza Indonesia · Level 4'), findsOneWidget);
  });

  testWidgets('hides the guest prompt once logged in', (tester) async {
    AppSession.instance.logIn('ibu@momspace.id');

    await tester.pumpWidget(const MaterialApp(home: ProfileScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Kamu sedang menjelajah sebagai Tamu'), findsNothing);
    expect(find.text('ibu@momspace.id'), findsOneWidget);
    expect(find.text('Keluar'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/screens/profile_screen_test.dart`
Expected: FAIL — neither file exists yet.

- [ ] **Step 3: Create the status pill**

Create `lib/widgets/profile/submission_status_pill.dart`:

```dart
import 'package:flutter/material.dart';

import '../../models/location_submission.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

/// 3-state status pill for a submitted location.
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru ›
/// Status pill component.
class SubmissionStatusPill extends StatelessWidget {
  const SubmissionStatusPill({super.key, required this.status});

  final SubmissionStatus status;

  @override
  Widget build(BuildContext context) {
    final (bg, border, text, label) = switch (status) {
      SubmissionStatus.pending => (AppColors.amberTint, AppColors.amberBorder, AppColors.amber, 'Pending verifikasi'),
      SubmissionStatus.approved => (AppColors.sageTint, AppColors.secondary.withValues(alpha: 0.36), AppColors.sageDk, 'Disetujui & tayang'),
      SubmissionStatus.rejected => (const Color(0x1FC97A6E), const Color(0x47C97A6E), AppColors.primaryDeep, 'Ditolak'),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999), border: Border.all(color: border)),
      child: Text(label, style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w700, color: text)),
    );
  }
}
```

- [ ] **Step 4: Create the Profile screen**

Create `lib/screens/profile_screen.dart`:

```dart
import 'package:flutter/material.dart';

import '../data/app_session.dart';
import '../data/repository.dart';
import '../models/condition_report.dart';
import '../models/location_submission.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/profile/submission_status_pill.dart';
import 'login_screen.dart';

/// Points, contribution history, and guest/login state.
/// No pixel mockup exists for this screen in design_handoff_momspace/ —
/// styled from the existing token system.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Future<void> _openLogin() async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
  }

  String _relativeTime(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) return 'Baru saja';
    if (diff.inMinutes < 60) return '${diff.inMinutes} menit lalu';
    if (diff.inHours < 24) return '${diff.inHours} jam lalu';
    return '${diff.inDays} hari lalu';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: ListenableBuilder(
          listenable: AppSession.instance,
          builder: (context, _) {
            final loggedIn = AppSession.instance.displayLabel != null;
            return ListenableBuilder(
              listenable: RoomRepository.instance,
              builder: (context, __) {
                final repo = RoomRepository.instance;
                return ListView(
                  padding: const EdgeInsets.fromLTRB(AppSpacing.s18, AppSpacing.s18, AppSpacing.s18, 88 + AppSpacing.s24),
                  children: [
                    Text('Profil', style: AppTypography.screenTitle),
                    const SizedBox(height: 20),
                    _buildIdentityCard(loggedIn),
                    const SizedBox(height: 16),
                    if (!loggedIn) ...[
                      _buildGuestPromptCard(),
                      const SizedBox(height: 16),
                    ],
                    _buildPointsCard(repo.rewardPoints),
                    const SizedBox(height: 24),
                    Text('Riwayat Laporan', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 12),
                    if (repo.reports.isEmpty)
                      _buildEmptyState('Belum ada laporan kondisi yang kamu kirim.')
                    else
                      for (final report in repo.reports) ...[
                        _buildReportTile(report),
                        const SizedBox(height: 8),
                      ],
                    const SizedBox(height: 24),
                    Text('Riwayat Lokasi Diusulkan', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 12),
                    if (repo.submissions.isEmpty)
                      _buildEmptyState('Belum ada lokasi yang kamu usulkan.')
                    else
                      for (final submission in repo.submissions) ...[
                        _buildSubmissionTile(submission),
                        const SizedBox(height: 8),
                      ],
                    if (loggedIn) ...[
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: () => AppSession.instance.logOut(),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.dividerStrong),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                          ),
                          child: Text('Keluar', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.body)),
                        ),
                      ),
                    ],
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }

  Widget _buildIdentityCard(bool loggedIn) {
    final label = AppSession.instance.displayLabel ?? 'Mode Tamu';
    final initial = loggedIn ? label.substring(0, 1).toUpperCase() : 'T';
    return Row(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: const BoxDecoration(gradient: LinearGradient(colors: [AppColors.primary, AppColors.rose03]), shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Text(initial, style: AppTypography.nunito(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800), overflow: TextOverflow.ellipsis),
              Text(
                loggedIn ? 'Akun MomSpace' : 'Menjelajah tanpa akun',
                style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textFaint),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildGuestPromptCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(AppRadius.cardLg),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Kamu sedang menjelajah sebagai Tamu', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(
            'Masuk untuk menyimpan poin dan riwayat kontribusimu di perangkat lain.',
            style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.body),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _openLogin,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                elevation: 0,
              ),
              child: Text('Masuk / Daftar', style: AppTypography.nunito(fontSize: 13.5, fontWeight: FontWeight.w800, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPointsCard(int points) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(AppRadius.cardLg)),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
              borderRadius: BorderRadius.circular(14),
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.star_rounded, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('$points', style: AppTypography.dashboardStat),
              Text('poin kontribusi', style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14)),
      child: Text(message, style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
    );
  }

  Widget _buildReportTile(ConditionReport report) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.fact_check_outlined, color: AppColors.primaryPressed, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(report.roomName, style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text(
                  '${report.conditions.join(', ')} · ${_relativeTime(report.timestamp)}',
                  style: AppTypography.quicksand(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmissionTile(LocationSubmission submission) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.add_location_alt_outlined, color: AppColors.sageDk, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(submission.name, style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text(_relativeTime(submission.timestamp), style: AppTypography.quicksand(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
              ],
            ),
          ),
          SubmissionStatusPill(status: submission.status),
        ],
      ),
    );
  }
}
```

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `flutter test test/screens/profile_screen_test.dart`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add lib/widgets/profile/submission_status_pill.dart lib/screens/profile_screen.dart test/screens/profile_screen_test.dart
git commit -m "feat: add Profile screen with points, history, and guest/login state"
```

---

### Task 8: Wire RootShell — swap placeholders, thread the search-tab callback

**Files:**
- Modify: `lib/screens/root_shell.dart` (full rewrite)
- Test: `test/screens/root_shell_navigation_test.dart`

**Interfaces:**
- Consumes: `SearchScreen` (Task 5), `ProfileScreen` (Task 7), `HomeMapScreen({onRoomSelected, onSearchTap})` (Task 4).

- [ ] **Step 1: Write the failing test**

Create `test/screens/root_shell_navigation_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/screens/root_shell.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('tapping the Search nav tab switches the IndexedStack to index 1', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: RootShell()));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 0);

    await tester.tap(find.text('Search'));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 1);
  });

  testWidgets('tapping the Profile nav tab switches the IndexedStack to index 2', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: RootShell()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Profile'));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 2);
  });

  testWidgets('tapping the Home Map search pill switches to the Search tab', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: RootShell()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Cari ruang laktasi terdekat...'));
    await tester.pumpAndSettle();

    expect(tester.widget<IndexedStack>(find.byType(IndexedStack)).index, 1);
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/screens/root_shell_navigation_test.dart`
Expected: FAIL — `RootShell` currently shows `PlaceholderScreen`s for Search/Profile and never switches tabs from the search pill tap.

- [ ] **Step 3: Rewrite the screen**

Replace the full contents of `lib/screens/root_shell.dart`:

```dart
import 'package:flutter/material.dart';

import 'home_map_screen.dart';
import 'profile_screen.dart';
import 'search_screen.dart';
import '../models/room.dart';
import '../widgets/nav/classic_pill_navbar.dart';
import '../widgets/report_hub_sheet.dart';

class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _activeTab = 0;
  Room? _selectedRoom;

  void _onTabChanged(int index) {
    if (index == 2) {
      // Report tab opens bottom sheet, pre-filled with the currently
      // selected map room if there is one.
      showReportHubSheet(context, contextRoom: _selectedRoom);
    } else {
      setState(() => _activeTab = index);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Map index to IndexedStack: Map(0) -> 0, Search(1) -> 1, Profile(3) -> 2
    int stackIndex = 0;
    if (_activeTab == 1) stackIndex = 1;
    if (_activeTab == 3) stackIndex = 2;

    return Scaffold(
      body: Stack(
        children: [
          IndexedStack(
            index: stackIndex,
            children: [
              HomeMapScreen(
                onRoomSelected: (room) => _selectedRoom = room,
                onSearchTap: () => setState(() => _activeTab = 1),
              ),
              const SearchScreen(),
              const ProfileScreen(),
            ],
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: ClassicPillNavBar(
              activeIndex: _activeTab,
              onChanged: _onTabChanged,
            ),
          ),
        ],
      ),
    );
  }
}
```

Note: this deletes the `PlaceholderScreen` class entirely — it is no longer referenced anywhere once both placeholders are replaced.

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `flutter test test/screens/root_shell_navigation_test.dart`
Expected: PASS (3 tests)

- [ ] **Step 5: Run the full test suite**

Run: `flutter test`
Expected: All tests PASS, including `test/widget_test.dart`.

- [ ] **Step 6: Commit**

```bash
git add lib/screens/root_shell.dart test/screens/root_shell_navigation_test.dart
git commit -m "feat: wire Search and Profile screens into RootShell navigation"
```

---

### Task 9: Manual QA pass (whole app)

**Files:** none (verification only)

- [ ] **Step 1: Run the full automated suite one more time**

Run: `flutter analyze && flutter test`
Expected: No errors, all tests PASS.

- [ ] **Step 2: Launch the app**

Run: `flutter run` (or use the `run` skill if available).

- [ ] **Step 3: Walk every screen this plan touched**

- **Detail screen:** open a room that's open (e.g. Plaza Indonesia). Tap Check-In — confirm the button flips to "Check-Out · 29:59" (ticking down live), the photo badge shows "Sedang digunakan", and the Home Map's bottom sheet for that room also shows "Sedang digunakan" when you navigate back. Tap Check-Out — confirm it reverts. Open a closed room (e.g. Sarinah) — confirm Check-In is disabled (matches the existing disabled treatment already used for Navigasi).
- **Home Map:** tap the search pill and the filter icon — both should jump to the Search tab. Tap the layers button — confirm the "Legenda Peta" sheet opens with the three pin-color rows. Tap a nearby-room card in the empty-sheet horizontal list — confirm it opens that room's Detail screen (this was previously dead).
- **Search tab:** type a query, toggle "Buka sekarang", toggle a facility chip, switch between "Terdekat"/"Rating tertinggi" — confirm the result list updates each time and tapping a result opens its Detail screen.
- **Profile tab (guest):** confirm the guest prompt card, 0 points, and both empty-history states show. Submit a Laporan Kondisi and a Tambah Lokasi Baru from the Report tab, return to Profile — confirm points went to 10, the report appears under "Riwayat Laporan", and the submission appears under "Riwayat Lokasi Diusulkan" with a "Pending verifikasi" pill.
- **Login flow:** from the guest prompt, tap "Masuk / Daftar" — confirm the Login screen opens, empty submit shows the validation error, a valid email/password logs in and returns to a Profile now showing that email and a "Keluar" button. Tap "Daftar" — confirm the "belum tersedia" snackbar appears. Log out — confirm it reverts to the guest prompt.

- [ ] **Step 4: Record any visual deltas**

This plan targets functional/structural parity for screens that have no design mockup (Search, Profile, Login) and functional completeness for screens that do (Detail's Check-In). Minor spacing/color polish deltas are expected and fine to fix ad hoc — they are not blocking.
