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
