import 'package:flutter/foundation.dart';

import '../models/room.dart';

class RoomRepository extends ChangeNotifier {
  final List<Room> _rooms = [];
  final List<Map<String, dynamic>> _reports = [];
  final List<Map<String, dynamic>> _submissions = [];

  int _rewardPoints = 0;
  int get rewardPoints => _rewardPoints;

  static final RoomRepository instance = RoomRepository._internal();

  RoomRepository._internal();

  void addReport(Map<String, dynamic> report) {
    _reports.add(report);
    _rewardPoints += 10;
    notifyListeners();
  }

  void addSubmission(Map<String, dynamic> submission) {
    _submissions.add(submission);
    notifyListeners();
  }
}
