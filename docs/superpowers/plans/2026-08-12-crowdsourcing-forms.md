# Crowdsourcing Forms (Laporan Kondisi & Tambah Lokasi Baru) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the two crowdsourcing screens (`Laporan Kondisi` and `Tambah Lokasi Baru`) to match the pixel-level spec in `design_handoff_momspace/README.md`, and give `RoomRepository` real on-device persistence (SharedPreferences) so reward points, reports, and submissions survive an app restart — with **no backend/Firebase work** in scope.

**Architecture:** Two typed data models (`ConditionReport`, `LocationSubmission`) replace the current `Map<String, dynamic>` shape in `RoomRepository`, which becomes an async-initialized, SharedPreferences-backed `ChangeNotifier` singleton. A set of small, reusable form widgets (`lib/widgets/forms/`) implement the shared visual pieces (header, chips, photo pickers, success/pending celebrations) so both screens compose them rather than duplicating layout code. A new `LocationPickerScreen` adds a real (tap-to-place) map-pin picker for "Titik di peta", replacing the current static placeholder.

**Tech Stack:** Flutter 3.35 / Dart 3.9, existing `maplibre_gl` for the map picker, new `image_picker` for photo selection, new `shared_preferences` for local persistence. No new state-management library — the existing `ChangeNotifier` singleton pattern is kept.

## Global Constraints

- No backend/Firebase work of any kind in this plan — all persistence is local (SharedPreferences), all "verification" flows are UI-only (status stays `pending` forever; there is no admin reviewer in this app).
- Indonesian UI copy must match `design_handoff_momspace/README.md` verbatim where quoted there (it is explicitly called out as "production-ready" copy in that doc, including the 🌸 emoji in the Laporan success title — keep it, it is app content, not assistant output).
- Follow existing design-token usage: colors from `AppColors`, radii/spacing from `AppRadius`/`AppSpacing`, shadows from `AppShadows`, text styles from `AppTypography`. Do not hardcode new raw hex colors unless the exact token is missing from `lib/theme/app_colors.dart` (in which case use the literal value from the README's token table, matching the existing `Color(0x..)` alpha-encoding style).
- Follow the existing repo convention of doc-comments referencing the design source (see `lib/models/room.dart`, `lib/widgets/home_map/map_pin.dart` for the `/// Source: ...` comment style) on every new widget/model file.
- After every task, run `flutter analyze` and fix any reported issues before moving to the next task.

---

## File Structure

**New files:**
- `lib/models/condition_report.dart` — `ConditionReport` data class + JSON (de)serialization
- `lib/models/location_submission.dart` — `LocationSubmission` data class + `SubmissionStatus` enum + JSON (de)serialization
- `lib/widgets/forms/form_screen_header.dart` — shared 70px screen header (back button, centered title, optional rose subtitle)
- `lib/widgets/forms/dashed_border_box.dart` — reusable dashed-border painter (`DashedBorderBox` widget + exported `DashedRingPainter`)
- `lib/widgets/forms/notes_field.dart` — optional-notes textarea with live `n / 200` counter
- `lib/widgets/forms/condition_chip.dart` — positive/negative selectable condition chip
- `lib/widgets/forms/reward_banner.dart` — "+N poin kontribusi" banner
- `lib/widgets/forms/single_photo_upload_field.dart` — one-photo picker (used by Laporan Kondisi)
- `lib/widgets/forms/photo_grid_upload_field.dart` — up-to-3-photo grid picker (used by Tambah Lokasi Baru)
- `lib/widgets/forms/success_celebration.dart` — checkmark success screen (rotating dashed ring, twinkling sparkles, pop-in check)
- `lib/widgets/forms/pending_celebration.dart` — hourglass "pending verification" screen
- `lib/screens/location_picker_screen.dart` — full-screen map, tap to drop a pin, returns a `LatLng`
- `test/data/repository_test.dart`
- `test/screens/report_condition_screen_test.dart`
- `test/screens/submit_location_screen_test.dart`

**Modified files:**
- `pubspec.yaml` — add `shared_preferences`, `image_picker`
- `lib/main.dart` — async `main()`, awaits `RoomRepository.instance.init()` before `runApp`
- `lib/data/repository.dart` — rewritten to use typed models + SharedPreferences persistence
- `lib/screens/report_condition_screen.dart` — full rewrite to match spec
- `lib/screens/submit_location_screen.dart` — full rewrite to match spec
- `lib/screens/root_shell.dart` — tracks the currently-selected room and forwards it into the Report Hub
- `lib/screens/home_map_screen.dart` — reports room selection upward via a new callback
- `lib/widgets/report_hub_sheet.dart` — accepts and forwards an optional context room
- `ios/Runner/Info.plist` — add `NSPhotoLibraryUsageDescription`

---

### Task 1: Add dependencies

**Files:**
- Modify: `pubspec.yaml`

**Interfaces:**
- Produces: `shared_preferences` and `image_picker` packages available to all later tasks.

- [ ] **Step 1: Add the packages**

Run:
```bash
flutter pub add shared_preferences image_picker
```

This resolves and pins compatible versions automatically (do not hand-edit version numbers).

- [ ] **Step 2: Verify the app still builds**

Run: `flutter analyze`
Expected: No new errors (only pre-existing warnings, if any).

- [ ] **Step 3: Add the iOS photo-library usage description**

In `ios/Runner/Info.plist`, add this key next to the existing `NSLocationWhenInUseUsageDescription` entry (same file, same style):

```xml
	<key>NSPhotoLibraryUsageDescription</key>
	<string>MomSpace membutuhkan akses galeri untuk melampirkan foto kondisi ruang laktasi.</string>
```

- [ ] **Step 4: Commit**

```bash
git add pubspec.yaml pubspec.lock ios/Runner/Info.plist
git commit -m "chore: add shared_preferences and image_picker dependencies"
```

---

### Task 2: Typed models + persistence-backed RoomRepository

**Files:**
- Create: `lib/models/condition_report.dart`
- Create: `lib/models/location_submission.dart`
- Modify: `lib/data/repository.dart`
- Modify: `lib/main.dart`
- Test: `test/data/repository_test.dart`

**Interfaces:**
- Produces:
  - `class ConditionReport { id, roomId, roomName, conditions: List<String>, timestamp: DateTime, photoPath: String?, notes: String }` with `toJson()`/`ConditionReport.fromJson(Map<String,dynamic>)`
  - `enum SubmissionStatus { pending, approved, rejected }`
  - `class LocationSubmission { id, name, address, latitude: double, longitude: double, category: String, timestamp: DateTime, facilities: List<String>, photoPaths: List<String>, openTime: String?, closeTime: String?, notes: String, status: SubmissionStatus }` with `toJson()`/`LocationSubmission.fromJson(Map<String,dynamic>)`
  - `RoomRepository.instance` (unchanged singleton access pattern) with:
    - `Future<void> init()`
    - `List<ConditionReport> get reports`
    - `List<LocationSubmission> get submissions`
    - `int get rewardPoints`
    - `Future<void> addReport(ConditionReport report)`
    - `Future<void> addSubmission(LocationSubmission submission)`

- [ ] **Step 1: Write the failing repository test**

Create `test/data/repository_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/models/condition_report.dart';
import 'package:momspace/models/location_submission.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('addReport stores the report and awards 10 points', () async {
    await RoomRepository.instance.init();

    await RoomRepository.instance.addReport(
      ConditionReport(
        id: '1',
        roomId: 'room-1',
        roomName: 'Test Room',
        conditions: const ['Bersih'],
        timestamp: DateTime(2026, 1, 1),
      ),
    );

    expect(RoomRepository.instance.rewardPoints, 10);
    expect(RoomRepository.instance.reports, hasLength(1));
    expect(RoomRepository.instance.reports.first.roomName, 'Test Room');
  });

  test('addSubmission does not award points, and defaults to pending status',
      () async {
    await RoomRepository.instance.init();

    await RoomRepository.instance.addSubmission(
      LocationSubmission(
        id: 's1',
        name: 'New Location',
        address: 'Jl. Test',
        latitude: -6.2,
        longitude: 106.8,
        category: 'Taman Kota',
        timestamp: DateTime(2026, 1, 1),
      ),
    );

    expect(RoomRepository.instance.rewardPoints, 0);
    expect(RoomRepository.instance.submissions.single.status,
        SubmissionStatus.pending);
  });

  test('data survives re-initialization (simulated app restart)', () async {
    await RoomRepository.instance.init();
    await RoomRepository.instance.addSubmission(
      LocationSubmission(
        id: 's1',
        name: 'New Location',
        address: 'Jl. Test',
        latitude: -6.2,
        longitude: 106.8,
        category: 'Taman Kota',
        timestamp: DateTime(2026, 1, 1),
      ),
    );

    // Re-run init() against the same mocked SharedPreferences store.
    await RoomRepository.instance.init();

    expect(RoomRepository.instance.submissions, hasLength(1));
    expect(RoomRepository.instance.submissions.first.name, 'New Location');
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/data/repository_test.dart`
Expected: FAIL — `RoomRepository` has no `init()`, and `addReport`/`addSubmission` don't accept typed models yet.

- [ ] **Step 3: Create `ConditionReport`**

Create `lib/models/condition_report.dart`:

```dart
/// A single crowdsourced condition report for a lactation room.
/// Source: design_handoff_momspace/README.md § 4. Laporan Kondisi
/// § State Management › Laporan Kondisi.
class ConditionReport {
  const ConditionReport({
    required this.id,
    required this.roomId,
    required this.roomName,
    required this.conditions,
    required this.timestamp,
    this.photoPath,
    this.notes = '',
  });

  final String id;
  final String roomId;
  final String roomName;
  final List<String> conditions;
  final DateTime timestamp;
  final String? photoPath;
  final String notes;

  Map<String, dynamic> toJson() => {
        'id': id,
        'roomId': roomId,
        'roomName': roomName,
        'conditions': conditions,
        'timestamp': timestamp.toIso8601String(),
        'photoPath': photoPath,
        'notes': notes,
      };

  factory ConditionReport.fromJson(Map<String, dynamic> json) =>
      ConditionReport(
        id: json['id'] as String,
        roomId: json['roomId'] as String,
        roomName: json['roomName'] as String,
        conditions: (json['conditions'] as List<dynamic>).cast<String>(),
        timestamp: DateTime.parse(json['timestamp'] as String),
        photoPath: json['photoPath'] as String?,
        notes: json['notes'] as String? ?? '',
      );
}
```

- [ ] **Step 4: Create `LocationSubmission`**

Create `lib/models/location_submission.dart`:

```dart
/// Verification status of a user-submitted new location.
/// This app has no admin reviewer (that's dashboard/backend scope), so
/// submissions stay `pending` indefinitely — the enum exists so the model
/// and any future Profile screen already speak the right vocabulary.
enum SubmissionStatus { pending, approved, rejected }

/// A user-proposed new lactation room, awaiting verification.
/// Source: design_handoff_momspace/README.md § 5. Tambah Lokasi Baru
/// § State Management › Tambah Lokasi.
class LocationSubmission {
  const LocationSubmission({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.category,
    required this.timestamp,
    this.facilities = const [],
    this.photoPaths = const [],
    this.openTime,
    this.closeTime,
    this.notes = '',
    this.status = SubmissionStatus.pending,
  });

  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final String category;
  final DateTime timestamp;
  final List<String> facilities;
  final List<String> photoPaths;
  final String? openTime;
  final String? closeTime;
  final String notes;
  final SubmissionStatus status;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'category': category,
        'timestamp': timestamp.toIso8601String(),
        'facilities': facilities,
        'photoPaths': photoPaths,
        'openTime': openTime,
        'closeTime': closeTime,
        'notes': notes,
        'status': status.name,
      };

  factory LocationSubmission.fromJson(Map<String, dynamic> json) =>
      LocationSubmission(
        id: json['id'] as String,
        name: json['name'] as String,
        address: json['address'] as String,
        latitude: json['latitude'] as double,
        longitude: json['longitude'] as double,
        category: json['category'] as String,
        timestamp: DateTime.parse(json['timestamp'] as String),
        facilities: (json['facilities'] as List<dynamic>? ?? []).cast<String>(),
        photoPaths: (json['photoPaths'] as List<dynamic>? ?? []).cast<String>(),
        openTime: json['openTime'] as String?,
        closeTime: json['closeTime'] as String?,
        notes: json['notes'] as String? ?? '',
        status: SubmissionStatus.values.firstWhere(
          (s) => s.name == json['status'],
          orElse: () => SubmissionStatus.pending,
        ),
      );
}
```

- [ ] **Step 5: Rewrite `RoomRepository`**

Replace the full contents of `lib/data/repository.dart`:

```dart
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/condition_report.dart';
import '../models/location_submission.dart';

/// App-wide store for user-generated contributions.
///
/// There is no backend in this build: everything lives in
/// [SharedPreferences] on-device. Call [init] once (from `main()`) before
/// reading/writing so persisted data is loaded first.
class RoomRepository extends ChangeNotifier {
  static final RoomRepository instance = RoomRepository._internal();

  RoomRepository._internal();

  static const _reportsKey = 'momspace_reports';
  static const _submissionsKey = 'momspace_submissions';
  static const _pointsKey = 'momspace_reward_points';

  SharedPreferences? _prefs;
  final List<ConditionReport> _reports = [];
  final List<LocationSubmission> _submissions = [];
  int _rewardPoints = 0;

  List<ConditionReport> get reports => List.unmodifiable(_reports);
  List<LocationSubmission> get submissions => List.unmodifiable(_submissions);
  int get rewardPoints => _rewardPoints;

  /// Loads persisted data. Safe to call more than once (e.g. in tests to
  /// simulate a restart) — it fully replaces in-memory state from storage.
  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();

    _rewardPoints = _prefs!.getInt(_pointsKey) ?? 0;

    _reports
      ..clear()
      ..addAll(
        (_prefs!.getStringList(_reportsKey) ?? []).map(
          (raw) => ConditionReport.fromJson(
            jsonDecode(raw) as Map<String, dynamic>,
          ),
        ),
      );

    _submissions
      ..clear()
      ..addAll(
        (_prefs!.getStringList(_submissionsKey) ?? []).map(
          (raw) => LocationSubmission.fromJson(
            jsonDecode(raw) as Map<String, dynamic>,
          ),
        ),
      );

    notifyListeners();
  }

  Future<void> addReport(ConditionReport report) async {
    _reports.insert(0, report);
    _rewardPoints += 10;
    await _persistReports();
    await _persistPoints();
    notifyListeners();
  }

  Future<void> addSubmission(LocationSubmission submission) async {
    _submissions.insert(0, submission);
    await _persistSubmissions();
    notifyListeners();
  }

  Future<void> _persistReports() async {
    await _prefs?.setStringList(
      _reportsKey,
      _reports.map((r) => jsonEncode(r.toJson())).toList(),
    );
  }

  Future<void> _persistSubmissions() async {
    await _prefs?.setStringList(
      _submissionsKey,
      _submissions.map((s) => jsonEncode(s.toJson())).toList(),
    );
  }

  Future<void> _persistPoints() async {
    await _prefs?.setInt(_pointsKey, _rewardPoints);
  }
}
```

- [ ] **Step 6: Wire `init()` into app startup**

Replace `lib/main.dart`:

```dart
import 'package:flutter/material.dart';

import 'data/repository.dart';
import 'screens/root_shell.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await RoomRepository.instance.init();
  runApp(const MomSpaceApp());
}

class MomSpaceApp extends StatelessWidget {
  const MomSpaceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MomSpace',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: const RootShell(),
    );
  }
}
```

- [ ] **Step 7: Run the test again to confirm it passes**

Run: `flutter test test/data/repository_test.dart`
Expected: PASS (3 tests)

- [ ] **Step 8: Confirm the pre-existing widget test still passes**

Run: `flutter test test/widget_test.dart`
Expected: PASS — it pumps `MomSpaceApp` directly without going through `main()`, so `RoomRepository.instance.init()` is never called for that test; nothing in the render path (`RootShell` → `HomeMapScreen`) reads from `RoomRepository`, so this is safe.

- [ ] **Step 9: Commit**

```bash
git add lib/models/condition_report.dart lib/models/location_submission.dart lib/data/repository.dart lib/main.dart test/data/repository_test.dart
git commit -m "feat: persist reports and submissions to SharedPreferences"
```

---

### Task 3: Shared form primitives — header, notes field, dashed border

**Files:**
- Create: `lib/widgets/forms/form_screen_header.dart`
- Create: `lib/widgets/forms/dashed_border_box.dart`
- Create: `lib/widgets/forms/notes_field.dart`

**Interfaces:**
- Produces:
  - `class FormScreenHeader extends StatelessWidget implements PreferredSizeWidget { const FormScreenHeader({required String title, String? subtitle}) }` — usable as a `Scaffold.appBar`.
  - `class DashedBorderBox extends StatelessWidget { const DashedBorderBox({required Widget child, Color color, double radius, double strokeWidth, double dashWidth, double dashGap}) }`
  - `class DashedRingPainter extends CustomPainter` (exported from the same file, reused by Task 6 and Task 7).
  - `class NotesField extends StatefulWidget { const NotesField({required TextEditingController controller, required String hintText, int maxLength = 200}) }`

- [ ] **Step 1: Create `FormScreenHeader`**

Create `lib/widgets/forms/form_screen_header.dart`:

```dart
import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

/// Shared 70px form-screen header: back circle, centered title, optional
/// rose subtitle beneath it.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Header,
/// § 5 Tambah Lokasi Baru › Header.
class FormScreenHeader extends StatelessWidget implements PreferredSizeWidget {
  const FormScreenHeader({super.key, required this.title, this.subtitle});

  final String title;
  final String? subtitle;

  @override
  Size get preferredSize => const Size.fromHeight(70);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 70,
      padding: EdgeInsets.only(top: MediaQuery.paddingOf(context).top),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.divider)),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Positioned(
            left: 14,
            child: _BackCircle(onTap: () => Navigator.maybePop(context)),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                textAlign: TextAlign.center,
                style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 2),
                Text(
                  subtitle!,
                  textAlign: TextAlign.center,
                  style: AppTypography.quicksand(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primaryPressed,
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _BackCircle extends StatelessWidget {
  const _BackCircle({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.surfaceSand,
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: const SizedBox(
          width: 38,
          height: 38,
          child: Icon(Icons.arrow_back_rounded, size: 20, color: AppColors.ink),
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Create `DashedBorderBox` + `DashedRingPainter`**

Create `lib/widgets/forms/dashed_border_box.dart`:

```dart
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
```

- [ ] **Step 3: Create `NotesField`**

Create `lib/widgets/forms/notes_field.dart`:

```dart
import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';

/// Optional notes textarea with a live `n / maxLength` mono counter.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Notes,
/// § 5 Tambah Lokasi Baru › Informasi tambahan.
class NotesField extends StatefulWidget {
  const NotesField({
    super.key,
    required this.controller,
    required this.hintText,
    this.maxLength = 200,
  });

  final TextEditingController controller;
  final String hintText;
  final int maxLength;

  @override
  State<NotesField> createState() => _NotesFieldState();
}

class _NotesFieldState extends State<NotesField> {
  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onChanged);
    super.dispose();
  }

  void _onChanged() => setState(() {});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceSand,
        borderRadius: BorderRadius.circular(AppRadius.card),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          TextField(
            controller: widget.controller,
            maxLength: widget.maxLength,
            minLines: 2,
            maxLines: 4,
            buildCounter: (_, {required currentLength, required isFocused, maxLength}) => null,
            style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.ink),
            decoration: InputDecoration(
              hintText: widget.hintText,
              hintStyle: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.placeholder),
              border: InputBorder.none,
              isDense: true,
              contentPadding: EdgeInsets.zero,
            ),
          ),
          Text(
            '${widget.controller.text.length} / ${widget.maxLength}',
            style: AppTypography.mono(fontSize: 10.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 4: Run analyzer**

Run: `flutter analyze`
Expected: No new errors.

- [ ] **Step 5: Commit**

```bash
git add lib/widgets/forms/form_screen_header.dart lib/widgets/forms/dashed_border_box.dart lib/widgets/forms/notes_field.dart
git commit -m "feat: add shared form-screen header, dashed border, and notes field widgets"
```

---

### Task 4: ConditionChip + RewardBanner widgets

**Files:**
- Create: `lib/widgets/forms/condition_chip.dart`
- Create: `lib/widgets/forms/reward_banner.dart`

**Interfaces:**
- Consumes: `AppMotion.fast` from `lib/theme/app_shadows.dart`.
- Produces:
  - `class ConditionChip extends StatelessWidget { const ConditionChip({required String label, required bool isPositive, required bool selected, required VoidCallback onTap}) }`
  - `class RewardBanner extends StatelessWidget { const RewardBanner({int points = 10}) }`

- [ ] **Step 1: Create `ConditionChip`**

Create `lib/widgets/forms/condition_chip.dart`:

```dart
import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_shadows.dart';
import '../../theme/app_typography.dart';

/// Positive/negative selectable condition chip used on the Laporan Kondisi
/// screen. Source: design_handoff_momspace/README.md § 4 Laporan Kondisi ›
/// Condition quick-select.
class ConditionChip extends StatelessWidget {
  const ConditionChip({
    super.key,
    required this.label,
    required this.isPositive,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool isPositive;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final Color bg;
    final Color border;
    final Color text;
    final Color badgeBg;
    final Color badgeGlyph;
    final IconData? icon;

    if (!selected) {
      bg = Colors.white;
      border = const Color(0x243C281E); // rgba(60,40,30,0.14)
      text = AppColors.textMuted;
      badgeBg = const Color(0xFFF4ECE3);
      badgeGlyph = AppColors.placeholder;
      icon = null;
    } else if (isPositive) {
      bg = AppColors.sageTint;
      border = const Color(0x738FAF8F); // rgba(143,175,143,0.45)
      text = const Color(0xFF5C7A5C);
      badgeBg = AppColors.secondary;
      badgeGlyph = Colors.white;
      icon = Icons.check;
    } else {
      bg = const Color(0x1FC97A6E); // rgba(201,122,110,0.12)
      border = const Color(0x47C97A6E); // rgba(201,122,110,0.28)
      text = AppColors.primaryDeep;
      badgeBg = AppColors.primaryDeep;
      badgeGlyph = Colors.white;
      icon = Icons.close;
    }

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: AppMotion.fast,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: border, width: 1.5),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(color: badgeBg, shape: BoxShape.circle),
              alignment: Alignment.center,
              child: icon != null ? Icon(icon, size: 13, color: badgeGlyph) : null,
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                label,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w700, color: text),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Create `RewardBanner`**

Create `lib/widgets/forms/reward_banner.dart`:

```dart
import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';

/// "+N poin kontribusi" banner shown at the bottom of Laporan Kondisi.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Reward banner.
class RewardBanner extends StatelessWidget {
  const RewardBanner({super.key, this.points = 10});

  final int points;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(AppRadius.cardLg),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.star_rounded, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink),
                    children: [
                      const TextSpan(text: 'Laporan ini memberi Anda '),
                      TextSpan(text: '+$points poin kontribusi', style: const TextStyle(fontWeight: FontWeight.w800)),
                    ],
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Poin dapat dilihat di halaman Profil',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 3: Run analyzer**

Run: `flutter analyze`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add lib/widgets/forms/condition_chip.dart lib/widgets/forms/reward_banner.dart
git commit -m "feat: add condition chip and reward banner widgets"
```

---

### Task 5: Photo upload widgets

**Files:**
- Create: `lib/widgets/forms/single_photo_upload_field.dart`
- Create: `lib/widgets/forms/photo_grid_upload_field.dart`

**Interfaces:**
- Consumes: `DashedBorderBox` from Task 3.
- Produces:
  - `class SinglePhotoUploadField extends StatelessWidget { const SinglePhotoUploadField({required File? photo, required Future<void> Function() onPick, required VoidCallback onRemove}) }`
  - `class PhotoGridUploadField extends StatelessWidget { const PhotoGridUploadField({required List<File> photos, required int maxPhotos, required Future<void> Function() onAdd, required void Function(int index) onRemove}) }`

- [ ] **Step 1: Create `SinglePhotoUploadField`**

Create `lib/widgets/forms/single_photo_upload_field.dart`:

```dart
import 'dart:io';

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'dashed_border_box.dart';

/// One-photo picker used by Laporan Kondisi. Empty state shows a dashed
/// upload prompt; filled state shows a thumbnail + filename/size + remove.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Photo upload.
class SinglePhotoUploadField extends StatelessWidget {
  const SinglePhotoUploadField({
    super.key,
    required this.photo,
    required this.onPick,
    required this.onRemove,
  });

  final File? photo;
  final Future<void> Function() onPick;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    if (photo == null) {
      return GestureDetector(
        onTap: onPick,
        child: DashedBorderBox(
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 20),
            decoration: BoxDecoration(
              color: AppColors.surfaceSand,
              borderRadius: BorderRadius.circular(AppRadius.cardLg),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                  child: const Icon(Icons.camera_alt_outlined, color: Colors.white, size: 20),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tambah foto',
                  style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primaryPressed),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final fileSizeKb = (photo!.lengthSync() / 1024).toStringAsFixed(0);
    final fileName = photo!.uri.pathSegments.last;

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(AppRadius.cardLg)),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.file(photo!, width: 70, height: 70, fit: BoxFit.cover),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fileName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.ink),
                ),
                const SizedBox(height: 2),
                Text('$fileSizeKb KB', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
              ],
            ),
          ),
          GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 30,
              height: 30,
              decoration: const BoxDecoration(color: AppColors.disabledFill, shape: BoxShape.circle),
              child: const Icon(Icons.close, size: 16, color: AppColors.body),
            ),
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 2: Create `PhotoGridUploadField`**

Create `lib/widgets/forms/photo_grid_upload_field.dart`:

```dart
import 'dart:io';

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import 'dashed_border_box.dart';

/// Up-to-N photo grid picker used by Tambah Lokasi Baru (max 3).
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru › Foto lokasi.
class PhotoGridUploadField extends StatelessWidget {
  const PhotoGridUploadField({
    super.key,
    required this.photos,
    required this.maxPhotos,
    required this.onAdd,
    required this.onRemove,
  });

  final List<File> photos;
  final int maxPhotos;
  final Future<void> Function() onAdd;
  final void Function(int index) onRemove;

  @override
  Widget build(BuildContext context) {
    final tiles = <Widget>[
      for (int i = 0; i < photos.length; i++)
        _PhotoTile(file: photos[i], onRemove: () => onRemove(i)),
      if (photos.length < maxPhotos) _AddTile(onTap: onAdd),
    ];

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      children: tiles,
    );
  }
}

class _PhotoTile extends StatelessWidget {
  const _PhotoTile({required this.file, required this.onRemove});

  final File file;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.tileMd),
            child: Image.file(file, fit: BoxFit.cover),
          ),
        ),
        Positioned(
          top: 4,
          right: 4,
          child: GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 22,
              height: 22,
              decoration: const BoxDecoration(color: Color(0xA6333727), shape: BoxShape.circle),
              child: const Icon(Icons.close, size: 13, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }
}

class _AddTile extends StatelessWidget {
  const _AddTile({required this.onTap});

  final Future<void> Function() onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: DashedBorderBox(
        radius: AppRadius.tileMd,
        child: const Center(child: Icon(Icons.add, color: AppColors.primaryPressed)),
      ),
    );
  }
}
```

- [ ] **Step 3: Run analyzer**

Run: `flutter analyze`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add lib/widgets/forms/single_photo_upload_field.dart lib/widgets/forms/photo_grid_upload_field.dart
git commit -m "feat: add single and grid photo upload widgets"
```

---

### Task 6: SuccessCelebration widget

**Files:**
- Create: `lib/widgets/forms/success_celebration.dart`

**Interfaces:**
- Consumes: `DashedRingPainter` from Task 3.
- Produces: `class SuccessCelebration extends StatefulWidget { const SuccessCelebration({required String title, required String subtitle, required String badgeText, required String primaryLabel, required VoidCallback onPrimary, required String secondaryLabel, required VoidCallback onSecondary}) }`

- [ ] **Step 1: Create the widget**

Create `lib/widgets/forms/success_celebration.dart`:

```dart
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'dashed_border_box.dart';

/// Full-screen success celebration: pop-in checkmark, rotating dashed ring,
/// staggered twinkling sparkles. Replaces the whole form body on submit.
/// Source: design_handoff_momspace/README.md § 4 Laporan Kondisi › Success
/// screen, § Interactions & Behavior › Animations.
class SuccessCelebration extends StatefulWidget {
  const SuccessCelebration({
    super.key,
    required this.title,
    required this.subtitle,
    required this.badgeText,
    required this.primaryLabel,
    required this.onPrimary,
    required this.secondaryLabel,
    required this.onSecondary,
  });

  final String title;
  final String subtitle;
  final String badgeText;
  final String primaryLabel;
  final VoidCallback onPrimary;
  final String secondaryLabel;
  final VoidCallback onSecondary;

  @override
  State<SuccessCelebration> createState() => _SuccessCelebrationState();
}

class _SuccessCelebrationState extends State<SuccessCelebration> with TickerProviderStateMixin {
  late final AnimationController _popController;
  late final AnimationController _ringController;
  late final AnimationController _sparkleController;

  @override
  void initState() {
    super.initState();
    _popController = AnimationController(vsync: this, duration: const Duration(milliseconds: 600))..forward();
    _ringController = AnimationController(vsync: this, duration: const Duration(seconds: 14))..repeat();
    _sparkleController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1600))..repeat();
  }

  @override
  void dispose() {
    _popController.dispose();
    _ringController.dispose();
    _sparkleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 140,
                height: 140,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    AnimatedBuilder(
                      animation: _ringController,
                      builder: (context, child) => Transform.rotate(
                        angle: _ringController.value * 2 * math.pi,
                        child: const CustomPaint(size: Size(140, 140), painter: DashedRingPainter()),
                      ),
                    ),
                    for (int i = 0; i < 3; i++)
                      AnimatedBuilder(
                        animation: _sparkleController,
                        builder: (context, child) {
                          final t = (_sparkleController.value + i / 3) % 1.0;
                          final opacity = (1 - (t - 0.5).abs() * 2).clamp(0.0, 1.0);
                          final angle = (i / 3) * 2 * math.pi;
                          return Positioned(
                            left: 70 + 55 * math.cos(angle) - 6,
                            top: 70 + 55 * math.sin(angle) - 6,
                            child: Opacity(
                              opacity: opacity,
                              child: const Icon(Icons.auto_awesome, size: 12, color: AppColors.primary),
                            ),
                          );
                        },
                      ),
                    ScaleTransition(
                      scale: CurvedAnimation(parent: _popController, curve: const Cubic(0.2, 1.4, 0.4, 1)),
                      child: Container(
                        width: 84,
                        height: 84,
                        decoration: const BoxDecoration(color: AppColors.secondary, shape: BoxShape.circle),
                        child: const Icon(Icons.check_rounded, color: Colors.white, size: 40),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(widget.title, textAlign: TextAlign.center, style: AppTypography.nunito(fontSize: 22, fontWeight: FontWeight.w900)),
              const SizedBox(height: 8),
              Text(widget.subtitle, textAlign: TextAlign.center, style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(color: AppColors.primaryTint, borderRadius: BorderRadius.circular(AppRadius.pill)),
                child: Text(widget.badgeText, style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w800, color: AppColors.primaryPressed)),
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: 220,
                child: ElevatedButton(
                  onPressed: widget.onPrimary,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.button)),
                    elevation: 0,
                  ),
                  child: Text(widget.primaryLabel, style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: widget.onSecondary,
                child: Text(
                  widget.secondaryLabel,
                  style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textFaint)
                      .copyWith(decoration: TextDecoration.underline),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
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
git add lib/widgets/forms/success_celebration.dart
git commit -m "feat: add success celebration animation widget"
```

---

### Task 7: PendingCelebration widget

**Files:**
- Create: `lib/widgets/forms/pending_celebration.dart`

**Interfaces:**
- Consumes: `DashedRingPainter` from Task 3.
- Produces: `class PendingCelebration extends StatefulWidget { const PendingCelebration({required String title, required String statusLabel, required String subtitle, required String primaryLabel, required VoidCallback onPrimary, required String secondaryLabel, required VoidCallback onSecondary}) }`

- [ ] **Step 1: Create the widget**

Create `lib/widgets/forms/pending_celebration.dart`:

```dart
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_spacing.dart';
import '../../theme/app_typography.dart';
import 'dashed_border_box.dart';

/// Full-screen "pending verification" celebration: gradient circle with a
/// flipping hourglass, rotating dashed ring. Replaces the whole form body
/// after a location submission.
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru ›
/// Pending screen, § Interactions & Behavior › Animations.
class PendingCelebration extends StatefulWidget {
  const PendingCelebration({
    super.key,
    required this.title,
    required this.statusLabel,
    required this.subtitle,
    required this.primaryLabel,
    required this.onPrimary,
    required this.secondaryLabel,
    required this.onSecondary,
  });

  final String title;
  final String statusLabel;
  final String subtitle;
  final String primaryLabel;
  final VoidCallback onPrimary;
  final String secondaryLabel;
  final VoidCallback onSecondary;

  @override
  State<PendingCelebration> createState() => _PendingCelebrationState();
}

class _PendingCelebrationState extends State<PendingCelebration> with TickerProviderStateMixin {
  late final AnimationController _hourglassController;
  late final AnimationController _ringController;

  @override
  void initState() {
    super.initState();
    _hourglassController = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat();
    _ringController = AnimationController(vsync: this, duration: const Duration(seconds: 12))..repeat();
  }

  @override
  void dispose() {
    _hourglassController.dispose();
    _ringController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 140,
                height: 140,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    AnimatedBuilder(
                      animation: _ringController,
                      builder: (context, child) => Transform.rotate(
                        angle: _ringController.value * 2 * math.pi,
                        child: const CustomPaint(size: Size(140, 140), painter: DashedRingPainter(color: AppColors.primary)),
                      ),
                    ),
                    Container(
                      width: 84,
                      height: 84,
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
                        shape: BoxShape.circle,
                      ),
                      child: AnimatedBuilder(
                        animation: _hourglassController,
                        builder: (context, child) {
                          final angle = _hourglassController.value < 0.5 ? 0.0 : math.pi;
                          return Transform.rotate(
                            angle: angle,
                            child: const Icon(Icons.hourglass_bottom_rounded, color: Colors.white, size: 36),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(widget.title, textAlign: TextAlign.center, style: AppTypography.nunito(fontSize: 22, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.amberTint,
                  border: Border.all(color: AppColors.amberBorder),
                  borderRadius: BorderRadius.circular(AppRadius.pill),
                ),
                child: Text(widget.statusLabel, style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.amber)),
              ),
              const SizedBox(height: 12),
              Text(widget.subtitle, textAlign: TextAlign.center, style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
              const SizedBox(height: 28),
              SizedBox(
                width: 220,
                child: ElevatedButton(
                  onPressed: widget.onPrimary,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.button)),
                    elevation: 0,
                  ),
                  child: Text(widget.primaryLabel, style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: widget.onSecondary,
                child: Text(
                  widget.secondaryLabel,
                  style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textFaint)
                      .copyWith(decoration: TextDecoration.underline),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
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
git add lib/widgets/forms/pending_celebration.dart
git commit -m "feat: add pending-verification celebration animation widget"
```

---

### Task 8: LocationPickerScreen (tap-to-place map pin)

**Files:**
- Create: `lib/screens/location_picker_screen.dart`

**Interfaces:**
- Consumes: `rasterizeWidget` (`lib/utils/map_marker_utils.dart`), `MapPin`/`PinState` (`lib/widgets/home_map/map_pin.dart`) — both already used the same way in `lib/screens/home_map_screen.dart`.
- Produces: `class LocationPickerScreen extends StatefulWidget { const LocationPickerScreen({LatLng? initialPosition}) }` — pushed with `Navigator.push<LatLng>(...)`; pops with the tapped `LatLng`, or `null` if the user backs out without picking.

**Design note (deviation from the HTML mockup):** the mockup shows a draggable center-pin. This implementation uses **tap-to-place** instead (tap anywhere on the map to drop/move the pin, then confirm) — same end result (a `LatLng`), simpler and more reliable to implement with `maplibre_gl`'s symbol API, which the codebase already uses this way in `HomeMapScreen`.

- [ ] **Step 1: Create the screen**

Create `lib/screens/location_picker_screen.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import '../utils/map_marker_utils.dart';
import '../widgets/home_map/map_pin.dart';

/// Full-screen map picker for "Titik di peta". Tap anywhere on the map to
/// drop a pin; "Gunakan lokasi ini" confirms and pops the picked [LatLng].
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru ›
/// Titik di peta (implemented as tap-to-place rather than a draggable
/// center-pin — see plan note).
class LocationPickerScreen extends StatefulWidget {
  const LocationPickerScreen({super.key, this.initialPosition});

  final LatLng? initialPosition;

  @override
  State<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _LocationPickerScreenState extends State<LocationPickerScreen> {
  static const _defaultCenter = LatLng(-6.1935, 106.8230);

  MapLibreMapController? _mapController;
  LatLng? _picked;
  bool _pinImageLoaded = false;

  @override
  void initState() {
    super.initState();
    _picked = widget.initialPosition;
  }

  Future<void> _loadPinImage() async {
    if (_mapController == null) return;
    final png = await rasterizeWidget(
      const MapPin(state: PinState.selected),
      context: context,
      logicalSize: const Size(38, 48),
    );
    await _mapController!.addImage('picker-pin', png);
    setState(() => _pinImageLoaded = true);
    if (_picked != null) {
      await _mapController!.addSymbol(
        SymbolOptions(geometry: _picked, iconImage: 'picker-pin', iconAnchor: 'bottom'),
      );
    }
  }

  Future<void> _onMapClick(point, coordinates) async {
    setState(() => _picked = coordinates as LatLng);
    if (_mapController == null || !_pinImageLoaded) return;
    await _mapController!.clearSymbols();
    await _mapController!.addSymbol(
      SymbolOptions(geometry: _picked, iconImage: 'picker-pin', iconAnchor: 'bottom'),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          MapLibreMap(
            initialCameraPosition: CameraPosition(target: widget.initialPosition ?? _defaultCenter, zoom: 16),
            styleString: 'assets/map_style_momspace.json',
            onMapCreated: (controller) => _mapController = controller,
            onStyleLoadedCallback: _loadPinImage,
            onMapClick: _onMapClick,
          ),
          Positioned(
            top: MediaQuery.paddingOf(context).top + 12,
            left: 14,
            child: _BackCircle(onTap: () => Navigator.pop(context)),
          ),
          Positioned(
            top: MediaQuery.paddingOf(context).top + 12,
            left: 66,
            right: 14,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
              child: Text(
                'Ketuk peta untuk menandai lokasi',
                style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w700, color: AppColors.body),
              ),
            ),
          ),
          Positioned(
            left: 14,
            right: 14,
            bottom: MediaQuery.paddingOf(context).bottom + 16,
            child: Column(
              children: [
                if (_picked != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                    child: Text(
                      '${_picked!.latitude.toStringAsFixed(4)}° LS, ${_picked!.longitude.toStringAsFixed(4)}° BT',
                      style: AppTypography.mono(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.body),
                    ),
                  ),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _picked == null ? null : () => Navigator.pop(context, _picked),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _picked == null ? AppColors.disabledFill : AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                      elevation: 0,
                    ),
                    child: Text(
                      'Gunakan lokasi ini',
                      style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: _picked == null ? AppColors.textFaint : Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BackCircle extends StatelessWidget {
  const _BackCircle({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: const SizedBox(width: 38, height: 38, child: Icon(Icons.arrow_back_rounded, size: 20, color: AppColors.ink)),
      ),
    );
  }
}
```

Note on `_onMapClick`: its parameters are left untyped (`point, coordinates`) so Dart infers them from `MapLibreMap.onMapClick`'s `OnMapClickCallback` typedef (`void Function(Point<double> point, LatLng coordinates)`, defined in `package:maplibre_gl/src/controller.dart`) — avoids importing `dart:math`'s `Point` just to name it. The explicit `as LatLng` cast on `coordinates` inside the body keeps the assignment to `_picked` (typed `LatLng?`) sound.

- [ ] **Step 2: Run analyzer**

Run: `flutter analyze`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add lib/screens/location_picker_screen.dart
git commit -m "feat: add tap-to-place map location picker screen"
```

---

### Task 9: Rebuild Laporan Kondisi screen

**Files:**
- Modify: `lib/screens/report_condition_screen.dart` (full rewrite)
- Test: `test/screens/report_condition_screen_test.dart`

**Interfaces:**
- Consumes: `RoomRepository.instance.addReport` (Task 2), `ConditionReport` (Task 2), `FormScreenHeader` (Task 3), `ConditionChip` + `RewardBanner` (Task 4), `SinglePhotoUploadField` (Task 5), `SuccessCelebration` (Task 6), `Room`/`demoSelectedRoom` (existing `lib/models/room.dart`, `lib/data/demo_rooms.dart`).
- Produces: `class ReportConditionScreen extends StatefulWidget { const ReportConditionScreen({Room? room}) }` — `room` is optional; falls back to `demoSelectedRoom` (same fallback convention already used in `HomeMapScreen` and `RoomBottomSheet`). This is consumed by Task 11.

- [ ] **Step 1: Write the failing widget test**

Create `test/screens/report_condition_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/screens/report_condition_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('Kirim Laporan is disabled until a condition chip is selected', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ReportConditionScreen()));
    await tester.pumpAndSettle();

    final submitFinder = find.widgetWithText(InkWell, 'Kirim Laporan');
    expect(tester.widget<InkWell>(submitFinder).onTap, isNull);

    await tester.tap(find.text('Bersih'));
    await tester.pump();

    expect(tester.widget<InkWell>(submitFinder).onTap, isNotNull);
  });

  testWidgets('submitting stores a report, awards points, and shows the success screen', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ReportConditionScreen()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Bersih'));
    await tester.pump();
    await tester.tap(find.text('Kirim Laporan'));
    await tester.pumpAndSettle();

    expect(find.textContaining('Terima kasih'), findsOneWidget);
    expect(RoomRepository.instance.rewardPoints, 10);
    expect(RoomRepository.instance.reports.single.conditions, contains('Bersih'));
  });

  testWidgets('tapping a chip twice deselects it', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: ReportConditionScreen()));
    await tester.pumpAndSettle();

    final submitFinder = find.widgetWithText(InkWell, 'Kirim Laporan');

    await tester.tap(find.text('Bersih'));
    await tester.pump();
    expect(tester.widget<InkWell>(submitFinder).onTap, isNotNull);

    await tester.tap(find.text('Bersih'));
    await tester.pump();
    expect(tester.widget<InkWell>(submitFinder).onTap, isNull);
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/screens/report_condition_screen_test.dart`
Expected: FAIL — current screen has a star-rating gate and different chip labels/copy.

- [ ] **Step 3: Rewrite the screen**

Replace the full contents of `lib/screens/report_condition_screen.dart`:

```dart
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../data/demo_rooms.dart';
import '../data/repository.dart';
import '../models/condition_report.dart';
import '../models/room.dart';
import '../theme/app_colors.dart';
import '../theme/app_shadows.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/forms/condition_chip.dart';
import '../widgets/forms/form_screen_header.dart';
import '../widgets/forms/notes_field.dart';
import '../widgets/forms/reward_banner.dart';
import '../widgets/forms/single_photo_upload_field.dart';
import '../widgets/forms/success_celebration.dart';

/// Submit a crowdsourced condition report for [room] (falls back to
/// [demoSelectedRoom] if none is given — same convention as
/// [RoomBottomSheet]). Earns +10 points; persisted via [RoomRepository].
/// Source: design_handoff_momspace/README.md § 4. Laporan Kondisi.
class ReportConditionScreen extends StatefulWidget {
  const ReportConditionScreen({super.key, this.room});

  final Room? room;

  @override
  State<ReportConditionScreen> createState() => _ReportConditionScreenState();
}

class _ReportConditionScreenState extends State<ReportConditionScreen> {
  static const _positiveConditions = ['Bersih', 'Kulkas menyala', 'Ruangan tersedia', 'Wastafel berfungsi'];
  static const _negativeConditions = ['Kotor', 'Kulkas mati', 'Ruangan terkunci', 'Fasilitas rusak'];

  final Set<String> _selectedConditions = {};
  final TextEditingController _notesController = TextEditingController();
  File? _photo;
  bool _submitted = false;

  Room get _room => widget.room ?? demoSelectedRoom;

  bool get _canSubmit => _selectedConditions.isNotEmpty;

  Future<void> _pickPhoto() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked != null) {
      setState(() => _photo = File(picked.path));
    }
  }

  void _toggleCondition(String label) {
    setState(() {
      if (!_selectedConditions.add(label)) _selectedConditions.remove(label);
    });
  }

  Future<void> _submit() async {
    if (!_canSubmit) return;
    await RoomRepository.instance.addReport(
      ConditionReport(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        roomId: _room.id,
        roomName: _room.name,
        conditions: _selectedConditions.toList(),
        photoPath: _photo?.path,
        notes: _notesController.text.trim(),
        timestamp: DateTime.now(),
      ),
    );
    if (!mounted) return;
    setState(() => _submitted = true);
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: _submitted ? null : FormScreenHeader(title: 'Laporan Kondisi', subtitle: _room.name),
      body: _submitted ? _buildSuccess(context) : _buildForm(context),
    );
  }

  Widget _buildSuccess(BuildContext context) {
    return SuccessCelebration(
      title: 'Terima kasih kontribusinya 🌸',
      subtitle: 'Laporanmu membantu ibu menyusui lain menemukan ruang yang tepat.',
      badgeText: '+10 poin ditambahkan!',
      primaryLabel: 'Kembali ke Peta',
      onPrimary: () => Navigator.of(context).popUntil((route) => route.isFirst),
      secondaryLabel: 'Lihat laporan saya',
      onSecondary: () => Navigator.of(context).popUntil((route) => route.isFirst),
    );
  }

  Widget _buildForm(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(AppSpacing.s18, AppSpacing.s18, AppSpacing.s18, AppSpacing.s24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Kondisi ruang saat ini', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 2.8,
                  children: [
                    for (final label in _positiveConditions)
                      ConditionChip(
                        label: label,
                        isPositive: true,
                        selected: _selectedConditions.contains(label),
                        onTap: () => _toggleCondition(label),
                      ),
                    for (final label in _negativeConditions)
                      ConditionChip(
                        label: label,
                        isPositive: false,
                        selected: _selectedConditions.contains(label),
                        onTap: () => _toggleCondition(label),
                      ),
                  ],
                ),
                const SizedBox(height: 28),
                Text('Foto kondisi (opsional)', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                SinglePhotoUploadField(photo: _photo, onPick: _pickPhoto, onRemove: () => setState(() => _photo = null)),
                const SizedBox(height: 6),
                Text(
                  'Foto membantu pengguna lain menilai fasilitas',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
                const SizedBox(height: 28),
                Text('Catatan tambahan (opsional)', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                NotesField(controller: _notesController, hintText: 'Ceritakan kondisi ruangan secara singkat...'),
                const SizedBox(height: 20),
                const RewardBanner(points: 10),
              ],
            ),
          ),
        ),
        _buildSubmitBar(context),
      ],
    );
  }

  Widget _buildSubmitBar(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(14, 12, 14, MediaQuery.paddingOf(context).bottom + 12),
      decoration: const BoxDecoration(color: AppColors.surface, border: Border(top: BorderSide(color: AppColors.divider))),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(AppRadius.buttonLg),
                gradient: _canSubmit ? const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]) : null,
                color: _canSubmit ? null : AppColors.disabledFill,
                boxShadow: _canSubmit ? AppShadows.roseCtaGlow : null,
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(AppRadius.buttonLg),
                  onTap: _canSubmit ? _submit : null,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.send_rounded, size: 18, color: _canSubmit ? Colors.white : AppColors.textFaint),
                        const SizedBox(width: 8),
                        Text(
                          'Kirim Laporan',
                          style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: _canSubmit ? Colors.white : AppColors.textFaint),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Laporan dikirim dengan timestamp otomatis',
            style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `flutter test test/screens/report_condition_screen_test.dart`
Expected: PASS (3 tests)

- [ ] **Step 5: Run the full test suite**

Run: `flutter test`
Expected: All tests PASS (including `test/widget_test.dart` and `test/data/repository_test.dart`).

- [ ] **Step 6: Commit**

```bash
git add lib/screens/report_condition_screen.dart test/screens/report_condition_screen_test.dart
git commit -m "feat: rebuild Laporan Kondisi screen to match design spec"
```

---

### Task 10: Rebuild Tambah Lokasi Baru screen

**Files:**
- Modify: `lib/screens/submit_location_screen.dart` (full rewrite)
- Test: `test/screens/submit_location_screen_test.dart`

**Interfaces:**
- Consumes: `RoomRepository.instance.addSubmission` (Task 2), `LocationSubmission` (Task 2), `FormScreenHeader`/`DashedBorderBox`/`NotesField` (Task 3), `PhotoGridUploadField` (Task 5), `PendingCelebration` (Task 7), `LocationPickerScreen` (Task 8).
- Produces: `class SubmitLocationScreen extends StatelessWidget` (unchanged public shape: `const SubmitLocationScreen()`, no constructor params) — already how `report_hub_sheet.dart` instantiates it, so no caller changes needed.

- [ ] **Step 1: Write the failing widget test**

Create `test/screens/submit_location_screen_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:momspace/data/repository.dart';
import 'package:momspace/screens/submit_location_screen.dart';

void main() {
  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    await RoomRepository.instance.init();
  });

  testWidgets('Kirim untuk Diverifikasi stays disabled without a picked location or category', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SubmitLocationScreen()));
    await tester.pumpAndSettle();

    ElevatedButton submitButton() =>
        tester.widget<ElevatedButton>(find.widgetWithText(ElevatedButton, 'Kirim untuk Diverifikasi'));

    expect(submitButton().onPressed, isNull);

    await tester.enterText(find.byType(TextField).at(0), 'Mall Kelapa Gading');
    await tester.enterText(find.byType(TextField).at(1), 'Jl. Boulevard Raya, Jakarta Utara');
    await tester.pump();

    // Name + address alone aren't enough — no location, no category yet.
    expect(submitButton().onPressed, isNull);

    await tester.tap(find.text('Taman Kota'));
    await tester.pump();

    // Category alone still isn't enough — the map pin was never picked.
    expect(submitButton().onPressed, isNull);
  });

  testWidgets('facility pills toggle selected state on tap', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: SubmitLocationScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Kulkas'), findsOneWidget);
    await tester.tap(find.text('Kulkas'));
    await tester.pump();
    await tester.tap(find.text('Kulkas'));
    await tester.pump();

    // No crash / exception across two toggles is the behavior under test —
    // full end-to-end submission requires the native map view and is
    // covered by the manual QA pass instead (Task 12).
  });
}
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `flutter test test/screens/submit_location_screen_test.dart`
Expected: FAIL — current screen has no `'Taman Kota'` category text, and enables submit with only a name.

- [ ] **Step 3: Rewrite the screen**

Replace the full contents of `lib/screens/submit_location_screen.dart`:

```dart
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

import '../data/repository.dart';
import '../models/location_submission.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/forms/dashed_border_box.dart';
import '../widgets/forms/form_screen_header.dart';
import '../widgets/forms/notes_field.dart';
import '../widgets/forms/pending_celebration.dart';
import '../widgets/forms/photo_grid_upload_field.dart';
import 'location_picker_screen.dart';

/// Propose a new, unlisted lactation room. Enters a `pending` status until
/// verified (there is no admin reviewer in this app — status just stays
/// `pending`; verification UI is out of scope, see plan Global Constraints).
/// Source: design_handoff_momspace/README.md § 5. Tambah Lokasi Baru.
class SubmitLocationScreen extends StatefulWidget {
  const SubmitLocationScreen({super.key});

  @override
  State<SubmitLocationScreen> createState() => _SubmitLocationScreenState();
}

class _SubmitLocationScreenState extends State<SubmitLocationScreen> {
  static const _categories = [
    ('Pusat Perbelanjaan', Icons.shopping_bag_outlined),
    ('Stasiun / Terminal', Icons.train_outlined),
    ('Rumah Sakit / Klinik', Icons.local_hospital_outlined),
    ('Perkantoran', Icons.apartment_outlined),
    ('Taman Kota', Icons.park_outlined),
    ('Lainnya', Icons.more_horiz_outlined),
  ];

  static const _facilityOptions = [
    'Kulkas', 'Wastafel', 'Stopkontak', 'AC', 'Stroller friendly', 'Privasi', 'Kursi menyusui', 'Cermin',
  ];

  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _notesController = TextEditingController();

  LatLng? _pickedLocation;
  String? _category;
  final Set<String> _selectedFacilities = {};
  final List<File> _photos = [];
  TimeOfDay? _openTime;
  TimeOfDay? _closeTime;
  bool _submitted = false;

  bool get _canSubmit =>
      _nameController.text.trim().isNotEmpty &&
      _addressController.text.trim().isNotEmpty &&
      _pickedLocation != null &&
      _category != null;

  Future<void> _pickLocation() async {
    final result = await Navigator.push<LatLng>(
      context,
      MaterialPageRoute(builder: (_) => LocationPickerScreen(initialPosition: _pickedLocation)),
    );
    if (result != null) setState(() => _pickedLocation = result);
  }

  Future<void> _addPhoto() async {
    if (_photos.length >= 3) return;
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked != null) {
      setState(() => _photos.add(File(picked.path)));
    }
  }

  Future<void> _pickTime({required bool isOpenTime}) async {
    final result = await showTimePicker(context: context, initialTime: const TimeOfDay(hour: 8, minute: 0));
    if (result != null) {
      setState(() {
        if (isOpenTime) {
          _openTime = result;
        } else {
          _closeTime = result;
        }
      });
    }
  }

  String _formatTime(TimeOfDay? time) {
    if (time == null) return '--.--';
    return '${time.hour.toString().padLeft(2, '0')}.${time.minute.toString().padLeft(2, '0')}';
  }

  Future<void> _submit() async {
    if (!_canSubmit) return;
    await RoomRepository.instance.addSubmission(
      LocationSubmission(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text.trim(),
        address: _addressController.text.trim(),
        latitude: _pickedLocation!.latitude,
        longitude: _pickedLocation!.longitude,
        category: _category!,
        facilities: _selectedFacilities.toList(),
        photoPaths: _photos.map((f) => f.path).toList(),
        openTime: _openTime == null ? null : _formatTime(_openTime),
        closeTime: _closeTime == null ? null : _formatTime(_closeTime),
        notes: _notesController.text.trim(),
        timestamp: DateTime.now(),
      ),
    );
    if (!mounted) return;
    setState(() => _submitted = true);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: _submitted ? null : const FormScreenHeader(title: 'Tambah Lokasi Baru'),
      body: _submitted ? _buildPending(context) : _buildForm(context),
    );
  }

  Widget _buildPending(BuildContext context) {
    return PendingCelebration(
      title: 'Lokasi berhasil dikirim!',
      statusLabel: 'Menunggu verifikasi',
      subtitle: 'Tim MomSpace akan memverifikasi lokasi ini dalam waktu maksimal 2 × 24 jam.',
      primaryLabel: 'Kembali ke Peta',
      onPrimary: () => Navigator.of(context).popUntil((route) => route.isFirst),
      secondaryLabel: 'Lihat status pengajuan di Profil',
      onSecondary: () => Navigator.of(context).popUntil((route) => route.isFirst),
    );
  }

  Widget _buildForm(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(AppSpacing.s18, AppSpacing.s18, AppSpacing.s18, AppSpacing.s24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoBanner(),
                const SizedBox(height: 24),
                _sectionLabel('INFORMASI DASAR'),
                const SizedBox(height: 10),
                _fieldCard([
                  _labeledField(
                    label: 'Nama lokasi',
                    required: true,
                    child: _textField(_nameController, 'cth. Plaza Indonesia · Level 4'),
                  ),
                  _labeledField(
                    label: 'Alamat lengkap',
                    required: true,
                    child: _textField(_addressController, 'Jl. M.H. Thamrin No.28–30, Jakarta Pusat'),
                  ),
                  _labeledField(label: 'Titik di peta', required: true, child: _buildLocationField()),
                  _labeledField(label: 'Kategori lokasi', required: true, child: _buildCategoryGrid()),
                ]),
                const SizedBox(height: 24),
                _sectionLabel('FASILITAS YANG TERSEDIA'),
                const SizedBox(height: 10),
                _buildFacilityPills(),
                const SizedBox(height: 6),
                Text(
                  'Tim verifikasi akan memeriksa kembali di lapangan',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
                const SizedBox(height: 24),
                _sectionLabel('FOTO LOKASI'),
                const SizedBox(height: 10),
                PhotoGridUploadField(photos: _photos, maxPhotos: 3, onAdd: _addPhoto, onRemove: (i) => setState(() => _photos.removeAt(i))),
                const SizedBox(height: 6),
                Text(
                  'Foto membantu tim verifikasi memastikan keberadaan ruang laktasi',
                  style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
                const SizedBox(height: 24),
                _sectionLabel('INFORMASI TAMBAHAN'),
                const SizedBox(height: 10),
                _buildOperatingHours(),
                const SizedBox(height: 16),
                NotesField(controller: _notesController, hintText: 'Informasi lain yang perlu diketahui...'),
              ],
            ),
          ),
        ),
        _buildSubmitBar(context),
      ],
    );
  }

  Widget _buildInfoBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.32)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
            child: const Icon(Icons.info_outline, size: 18, color: AppColors.primaryPressed),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Lokasi yang kamu tambahkan akan diverifikasi oleh tim MomSpace sebelum ditampilkan kepada pengguna lain.',
                  style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.ink),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 13, color: AppColors.primaryPressed),
                    const SizedBox(width: 4),
                    Text(
                      'Proses verifikasi maksimal 2 × 24 jam',
                      style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primaryPressed),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionLabel(String text) => Text(text, style: AppTypography.monoLabel());

  Widget _fieldCard(List<Widget> fields) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceSand,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        children: [
          for (int i = 0; i < fields.length; i++)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: i == 0 ? null : const BoxDecoration(border: Border(top: BorderSide(color: AppColors.divider))),
              child: fields[i],
            ),
        ],
      ),
    );
  }

  Widget _labeledField({required String label, required bool required, required Widget child}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            style: AppTypography.monoLabel(color: AppColors.placeholder),
            children: [
              TextSpan(text: label.toUpperCase()),
              if (required) const TextSpan(text: ' *', style: TextStyle(color: AppColors.primary)),
            ],
          ),
        ),
        const SizedBox(height: 8),
        child,
      ],
    );
  }

  Widget _textField(TextEditingController controller, String hint) {
    return TextField(
      controller: controller,
      onChanged: (_) => setState(() {}),
      style: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.ink),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
        border: InputBorder.none,
        isDense: true,
        contentPadding: EdgeInsets.zero,
      ),
    );
  }

  Widget _buildLocationField() {
    if (_pickedLocation == null) {
      return GestureDetector(
        onTap: _pickLocation,
        child: DashedBorderBox(
          color: AppColors.secondary,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            alignment: Alignment.center,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.location_on_outlined, color: AppColors.sageDk, size: 18),
                const SizedBox(width: 8),
                Text('Pilih di peta', style: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w700, color: AppColors.sageDk)),
              ],
            ),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: SizedBox(
            height: 110,
            child: IgnorePointer(
              child: MapLibreMap(
                initialCameraPosition: CameraPosition(target: _pickedLocation!, zoom: 15),
                styleString: 'assets/map_style_momspace.json',
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: Text(
                '${_pickedLocation!.latitude.toStringAsFixed(4)}° LS, ${_pickedLocation!.longitude.toStringAsFixed(4)}° BT',
                style: AppTypography.mono(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.body),
              ),
            ),
            GestureDetector(
              onTap: _pickLocation,
              child: Text('Ubah', style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primaryPressed)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCategoryGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      childAspectRatio: 2.4,
      children: [
        for (final (label, icon) in _categories)
          GestureDetector(
            onTap: () => setState(() => _category = label),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              decoration: BoxDecoration(
                color: _category == label ? AppColors.primaryTint : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _category == label ? AppColors.primary : AppColors.dividerStrong,
                  width: _category == label ? 1.5 : 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(icon, size: 16, color: _category == label ? AppColors.primaryPressed : AppColors.textMuted),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTypography.quicksand(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: _category == label ? AppColors.primaryPressed : AppColors.body,
                      ),
                    ),
                  ),
                  if (_category == label) const Icon(Icons.check_circle, size: 15, color: AppColors.primary),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildFacilityPills() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final facility in _facilityOptions)
          GestureDetector(
            onTap: () => setState(() {
              if (!_selectedFacilities.add(facility)) _selectedFacilities.remove(facility);
            }),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: _selectedFacilities.contains(facility) ? AppColors.sageTint : Colors.white,
                borderRadius: BorderRadius.circular(AppRadius.pill),
                border: Border.all(
                  color: _selectedFacilities.contains(facility) ? AppColors.secondary.withValues(alpha: 0.4) : AppColors.dividerStrong,
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    _selectedFacilities.contains(facility) ? Icons.check : Icons.add,
                    size: 13,
                    color: _selectedFacilities.contains(facility) ? AppColors.sageDk : AppColors.placeholder,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    facility,
                    style: AppTypography.quicksand(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: _selectedFacilities.contains(facility) ? AppColors.sageDk : AppColors.body,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildOperatingHours() {
    return Row(
      children: [
        Expanded(child: _timeBox('BUKA', _openTime, () => _pickTime(isOpenTime: true))),
        const Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: Icon(Icons.arrow_forward, size: 16, color: AppColors.placeholder)),
        Expanded(child: _timeBox('TUTUP', _closeTime, () => _pickTime(isOpenTime: false))),
        const SizedBox(width: 8),
        Text('WIB', style: AppTypography.monoLabel()),
      ],
    );
  }

  Widget _timeBox(String label, TimeOfDay? time, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.divider)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: AppTypography.monoLabel(fontSize: 9.5)),
            const SizedBox(height: 2),
            Text(_formatTime(time), style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitBar(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(14, 12, 14, MediaQuery.paddingOf(context).bottom + 12),
      decoration: const BoxDecoration(color: AppColors.surface, border: Border(top: BorderSide(color: AppColors.divider))),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _canSubmit ? _submit : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: _canSubmit ? AppColors.sageDk : AppColors.disabledFill,
                disabledBackgroundColor: AppColors.disabledFill,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.buttonLg)),
                elevation: 0,
              ),
              child: Text(
                'Kirim untuk Diverifikasi',
                style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: _canSubmit ? Colors.white : AppColors.textFaint),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text('* Wajib diisi', style: AppTypography.quicksand(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
        ],
      ),
    );
  }
}
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `flutter test test/screens/submit_location_screen_test.dart`
Expected: PASS (2 tests)

- [ ] **Step 5: Run the full test suite**

Run: `flutter test`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/screens/submit_location_screen.dart test/screens/submit_location_screen_test.dart
git commit -m "feat: rebuild Tambah Lokasi Baru screen to match design spec"
```

---

### Task 11: Thread selected-room context from Home Map into Report Hub

**Files:**
- Modify: `lib/screens/home_map_screen.dart`
- Modify: `lib/screens/root_shell.dart`
- Modify: `lib/widgets/report_hub_sheet.dart`

**Interfaces:**
- Consumes: `ReportConditionScreen({Room? room})` from Task 9.
- Produces: `showReportHubSheet(BuildContext context, {Room? contextRoom})` — when the user has a room selected on the map and taps the Report tab, "Laporkan Kondisi Ruang" opens `ReportConditionScreen` pre-filled with that room instead of always falling back to the hardcoded demo room.

- [ ] **Step 1: Add a selection callback to `HomeMapScreen`**

In `lib/screens/home_map_screen.dart`, add an `onRoomSelected` constructor parameter and call it from `_selectRoom`:

```dart
class HomeMapScreen extends StatefulWidget {
  const HomeMapScreen({super.key, this.onRoomSelected});

  final ValueChanged<Room?>? onRoomSelected;

  @override
  State<HomeMapScreen> createState() => _HomeMapScreenState();
}
```

In `_HomeMapScreenState._selectRoom`, after `_selectedRoomId = id;` is set (inside the same `setState`), call the callback with the resolved room:

```dart
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
```

(`_selectedRoom` is the existing getter already defined a few lines above in this class.)

- [ ] **Step 2: Track the selected room in `RootShell` and pass it to the Report Hub**

Replace the full contents of `lib/screens/root_shell.dart`:

```dart
import 'package:flutter/material.dart';

import '../models/room.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import '../widgets/nav/classic_pill_navbar.dart';
import 'home_map_screen.dart';
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
              HomeMapScreen(onRoomSelected: (room) => _selectedRoom = room),
              const PlaceholderScreen(title: 'Pencarian'),
              const PlaceholderScreen(title: 'Profil'),
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

class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(title, style: AppTypography.screenTitle),
            const SizedBox(height: 16),
            Text('Segera hadir', style: AppTypography.quicksand(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
            const SizedBox(height: 32),
            Icon(Icons.construction_rounded, size: 64, color: AppColors.primaryTint),
          ],
        ),
      ),
    );
  }
}
```

- [ ] **Step 3: Accept and forward `contextRoom` in `report_hub_sheet.dart`**

In `lib/widgets/report_hub_sheet.dart`, update the public entry point and the sheet widget to carry the room through to `ReportConditionScreen`:

```dart
void showReportHubSheet(BuildContext context, {Room? contextRoom}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.transparent,
    builder: (context) => _ReportHubSheet(contextRoom: contextRoom),
  );
}

class _ReportHubSheet extends StatelessWidget {
  const _ReportHubSheet({this.contextRoom});

  final Room? contextRoom;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // ...unchanged backdrop...
```

And in the "Laporkan Kondisi Ruang" `_OptionCard`'s `onTap`, pass the room through:

```dart
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => ReportConditionScreen(room: contextRoom)),
                        );
                      },
```

Add the model import at the top of the file:

```dart
import '../models/room.dart';
```

(Leave the rest of the file — the backdrop, sheet shell, `_OptionCard` class, "Tambah Lokasi Baru" card — unchanged.)

- [ ] **Step 4: Run analyzer and the full test suite**

Run: `flutter analyze && flutter test`
Expected: No errors; all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/screens/home_map_screen.dart lib/screens/root_shell.dart lib/widgets/report_hub_sheet.dart
git commit -m "feat: carry the selected map room into the Laporan Kondisi flow"
```

---

### Task 12: Manual QA pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full automated suite one more time**

Run: `flutter analyze && flutter test`
Expected: No errors, all tests PASS.

- [ ] **Step 2: Launch the app on a device/emulator**

Run: `flutter run` (or use the `run` skill if available in this session)

- [ ] **Step 3: Walk the Laporan Kondisi flow**

From the Report tab → "Laporkan Kondisi Ruang":
- Confirm the header subtitle shows a room name.
- Select/deselect condition chips — confirm positive chips turn sage, negative chips turn rose-warning, and the submit button is disabled with 0 chips selected.
- Add a photo from the gallery — confirm the thumbnail, filename, and size appear, and it can be removed.
- Type notes past 200 characters — confirm input is capped and the counter tracks it.
- Submit — confirm the success screen animates in (checkmark pop, rotating ring, sparkles) and "Kembali ke Peta" returns to the map.
- Compare side-by-side against `design_handoff_momspace/MomSpace Laporan.html` and `screenshots/04-laporan.png`.

- [ ] **Step 4: Walk the Tambah Lokasi Baru flow**

From the Report tab → "Tambah Lokasi Baru":
- Confirm the submit button stays disabled until name, address, a map point, and a category are all set.
- Tap "Pilih di peta", tap a point on the map, confirm via "Gunakan lokasi ini" — confirm the 110px map preview and coordinates appear back on the form, and "Ubah" reopens the picker.
- Select a category, toggle a few facility pills, add up to 3 photos (confirm the 4th add-tile disappears at 3), set open/close times, add notes.
- Submit — confirm the pending screen animates in (flipping hourglass, rotating ring) with the "Menunggu verifikasi" amber pill.
- Compare side-by-side against `design_handoff_momspace/MomSpace Submit Lokasi.html` and `screenshots/05-submit-lokasi.png`.

- [ ] **Step 5: Confirm persistence across a restart**

Submit one report and one location, then fully stop and relaunch the app (`flutter run` again, or hot-restart is *not* sufficient — do a cold stop/relaunch). Confirm `RoomRepository.instance.rewardPoints` (e.g. via a temporary `debugPrint` or breakpoint, since there's no Profile UI yet) reflects the prior session's points.

- [ ] **Step 6: Record any visual deltas**

Note any spacing/color/copy deltas found against the HTML mockups as follow-up items — this plan targets functional + structural parity, not pixel-perfect measurement matching, so minor spacing tweaks are expected and fine to fix ad hoc.
