from django.contrib import admin
from .models import Question
from .models import TestResult

admin.site.register(Question)
admin.site.register(TestResult)
