import '../models/room.dart';

/// Sample data reproducing the exact figures from
/// design_handoff_momspace/home-map.jsx (`SheetDefault`, `SheetEmpty`).
const Room demoSelectedRoom = Room(
  id: 'plaza-indonesia-l4',
  name: 'Plaza Indonesia · Level 4',
  avatarInitial: 'P',
  floorLabel: 'Lt. 4',
  distanceMeters: 220,
  isOpen: true,
  rating: 4.8,
  reviewCount: 124,
  facilities: ['Bersih', 'Kulkas', 'AC', 'Stroller'],
);

const List<Room> demoNearbyRooms = [
  Room(
    id: 'plaza-indonesia',
    name: 'Plaza Indonesia',
    avatarInitial: 'P',
    floorLabel: 'Lt. 4',
    distanceMeters: 220,
    isOpen: true,
    rating: 4.8,
    reviewCount: 0,
  ),
  Room(
    id: 'grand-indonesia',
    name: 'Grand Indonesia',
    avatarInitial: 'G',
    floorLabel: 'Lt. 3A',
    distanceMeters: 480,
    isOpen: true,
    rating: 4.6,
    reviewCount: 0,
  ),
  Room(
    id: 'senayan-city',
    name: 'Senayan City',
    avatarInitial: 'S',
    floorLabel: 'Lt. 5',
    distanceMeters: 1200,
    isOpen: true,
    rating: 4.7,
    reviewCount: 0,
  ),
  Room(
    id: 'pacific-place',
    name: 'Pacific Place',
    avatarInitial: 'P',
    floorLabel: 'Lt. 2',
    distanceMeters: 1800,
    isOpen: true,
    rating: 4.5,
    reviewCount: 0,
  ),
];
