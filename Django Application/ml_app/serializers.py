from rest_framework import serializers

class VideoAnalysisSerializer(serializers.Serializer):
    video = serializers.FileField()
    sequence_length = serializers.IntegerField(required=False, default=20)