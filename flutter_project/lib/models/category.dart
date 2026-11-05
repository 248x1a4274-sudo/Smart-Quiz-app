import 'package:flutter/material.dart';

/// Represents a quiz topic category in the Smart Quiz application.
class QuizCategory {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final Color primaryColor;
  final int? openTdbId;
  final int questionCount;

  const QuizCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.primaryColor,
    this.openTdbId,
    this.questionCount = 10,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'openTdbId': openTdbId,
        'questionCount': questionCount,
      };

  factory QuizCategory.fromJson(Map<String, dynamic> json, IconData icon, Color color) {
    return QuizCategory(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      icon: icon,
      primaryColor: color,
      openTdbId: json['openTdbId'] as int?,
      questionCount: json['questionCount'] as int? ?? 10,
    );
  }
}
