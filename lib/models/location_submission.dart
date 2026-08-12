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
