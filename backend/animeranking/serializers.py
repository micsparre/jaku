# appname/serializers.py

from rest_framework import serializers
from .models import Anime, UserAnimeRanking

class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = '__all__'

class UserAnimeRankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnimeRanking
        fields = '__all__'
        
from .models import Title

class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = '__all__'

