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
