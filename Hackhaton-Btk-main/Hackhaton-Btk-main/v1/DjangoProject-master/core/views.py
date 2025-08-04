from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden, JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserChangeForm
from django import forms
from .models import Question, GameResult, UserProfile, InitialTestAnswer
from .forms import QuestionForm, CustomUserCreationForm
from .models import TestResult
from django.contrib.auth.decorators import login_required
from datetime import datetime, timedelta
from django.shortcuts import render
import json

def home(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return redirect('login')

def register(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('initial_test')
    else:
        form = CustomUserCreationForm()
    return render(request, "register.html", {"form": form})

def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, "login.html", {"form": form})

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required(login_url='login')
def dashboard(request):
    profile = request.user.userprofile
    
    # Son aktiviteleri al
    recent_activities = GameResult.objects.filter(user=request.user).order_by('-played_at')[:4]
    
    # Haftalık istatistikler
    week_ago = datetime.now() - timedelta(days=7)
    weekly_games = GameResult.objects.filter(user=request.user, played_at__gte=week_ago)
    weekly_score_increase = sum([game.score for game in weekly_games])
    weekly_games_count = weekly_games.count()
    
    # Ortalama puan hesapla
    all_games = GameResult.objects.filter(user=request.user)
    if all_games.exists():
        profile.average_score = sum([game.score for game in all_games]) // all_games.count()
        profile.save()
    
    context = {
        'profile': profile,
        'recent_activities': recent_activities,
        'weekly_score_increase': weekly_score_increase,
        'weekly_games_count': weekly_games_count,
    }
    return render(request, "dashboard.html", context)



@login_required(login_url='login')
def games_view(request):
    return render(request, "games.html")

@login_required(login_url='login')
def vocablitz_view(request):
    return render(request, 'games/vocablitz.html')

@login_required(login_url='login')
def sentence_game_view(request):
    return render(request, 'games/sentence_game.html')

@login_required(login_url='login')
def grammar_typer_view(request):
    return render(request, 'games/grammar_typer.html')

@login_required(login_url='login')
def voice_pronunciation_view(request):
    return render(request, 'games/voice_pronunciation.html')



@login_required(login_url='login')
def tests_view(request):
    return render(request, "tests.html")

@login_required(login_url='login')
def ai_roleplay_view(request):
    return render(request, "ai_roleplay.html")

@login_required(login_url='login')
def level_test_view(request):
    return render(request, "level_test.html")

@login_required(login_url='login')
def ai_questions_view(request):
    return render(request, "ai_questions.html")

@login_required(login_url='login')
def settings_view(request):
    if request.method == "POST":
        # Kullanıcı bilgilerini güncelle
        user = request.user
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        user.save()
        messages.success(request, 'Profil bilgileriniz güncellendi!')
        return redirect('settings')
    
    return render(request, "settings.html")

@login_required(login_url='login')
def save_game_result(request):
    if request.method == "POST":
        data = json.loads(request.body)
        game_type = data.get('game_type')
        score = data.get('score')
        xp_gained = data.get('xp_gained', 0)
        
        # Oyun sonucunu kaydet
        GameResult.objects.create(
            user=request.user,
            game_type=game_type,
            score=score,
            xp_gained=xp_gained
        )
        
        # Kullanıcı profilini güncelle
        profile = request.user.userprofile
        profile.total_score += score
        profile.total_xp += xp_gained
        profile.games_played += 1
        profile.calculate_level()
        profile.save()
        
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False})

@login_required(login_url='login')
def chatbot_view(request):
    return render(request, 'chatbot.html')

@login_required(login_url='login')
def placement_test(request):
    question_ids = list(Question.objects.values_list('id', flat=True))
    question_ids.sort()

    if 'question_index' not in request.session:
        request.session['question_index'] = 0
        request.session['score'] = 0

    index = request.session['question_index']

    if index >= len(question_ids):
        # test zaten bitmişse doğrudan sonucu göster
        return redirect('test_result')

    question = Question.objects.get(id=question_ids[index])

    # ADMIN: yeni soru ekleme
    if request.method == "POST" and request.user.is_superuser and 'text' in request.POST:
        form = QuestionForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('placement')

    # USER: cevap gönderme
    if request.method == "POST" and not request.user.is_superuser:
        selected = request.POST.get('answer')
        if selected == question.correct_choice:
            request.session['score'] += 1
        request.session['question_index'] += 1

        if request.session['question_index'] >= len(question_ids):
            # Skoru veritabanına kaydet
            TestResult.objects.create(
                user=request.user,
                score=request.session['score'],
                total=len(question_ids)
            )
            return redirect('test_result')

        return redirect('placement')

    form = QuestionForm()
    return render(request, "placement_test.html", {
        "question": question,
        "form": form,
        "all_questions": Question.objects.all() if request.user.is_superuser else None,
        "results": TestResult.objects.all().order_by('-date_taken') if request.user.is_superuser else None
    })

@login_required
def test_result(request):
    score = request.session.get('score', 0)
    total = request.session.get('question_index', 0)
    # Session temizle
    request.session.pop('score', None)
    request.session.pop('question_index', None)
    return render(request, 'test_result.html', {'score': score, 'total': total})

@login_required
def edit_question(request, pk):
    if not request.user.is_superuser:
        return HttpResponseForbidden("Sadece admin düzenleyebilir.")

    question = get_object_or_404(Question, pk=pk)
    if request.method == "POST":
        form = QuestionForm(request.POST, instance=question)
        if form.is_valid():
            form.save()
            return redirect('placement')
    else:
        form = QuestionForm(instance=question)

    return render(request, 'edit_question.html', {'form': form, 'question': question})

@login_required
def delete_question(request, pk):
    if not request.user.is_superuser:
        return HttpResponseForbidden("Sadece admin silebilir.")

    question = get_object_or_404(Question, pk=pk)
    question.delete()
    return redirect('placement')

@login_required
def add_question(request):
    if not request.user.is_superuser:
        return HttpResponseForbidden("Sadece admin ekleyebilir.")

    form = QuestionForm(request.POST)
    if form.is_valid():
        form.save()
    return redirect('placement')

@login_required(login_url='login')
def initial_test(request):
    """10 soruluk başlangıç testi"""
    # Kullanıcının daha önce test yapıp yapmadığını kontrol et
    if InitialTestAnswer.objects.filter(user=request.user).exists():
        return redirect('dashboard')
    
    # Test soruları (örnek sorular - gerçek uygulamada veritabanından çekilebilir)
    test_questions = [
        {
            'number': 1,
            'question': 'What is the capital of England?',
            'choices': {
                'A': 'London',
                'B': 'Paris', 
                'C': 'Berlin'
            },
            'correct': 'A'
        },
        {
            'number': 2,
            'question': 'Which of the following is a verb?',
            'choices': {
                'A': 'Happy',
                'B': 'Run',
                'C': 'Fast'
            },
            'correct': 'B'
        },
        {
            'number': 3,
            'question': 'Complete the sentence: "I ___ to school every day."',
            'choices': {
                'A': 'goes',
                'B': 'go',
                'C': 'going'
            },
            'correct': 'B'
        },
        {
            'number': 4,
            'question': 'What is the opposite of "big"?',
            'choices': {
                'A': 'Large',
                'B': 'Small',
                'C': 'Huge'
            },
            'correct': 'B'
        },
        {
            'number': 5,
            'question': 'Which word is a color?',
            'choices': {
                'A': 'Dog',
                'B': 'Blue',
                'C': 'Book'
            },
            'correct': 'B'
        },
        {
            'number': 6,
            'question': 'How do you say "Hello" in English?',
            'choices': {
                'A': 'Goodbye',
                'B': 'Hello',
                'C': 'Thank you'
            },
            'correct': 'B'
        },
        {
            'number': 7,
            'question': 'What is 2 + 2?',
            'choices': {
                'A': '3',
                'B': '4',
                'C': '5'
            },
            'correct': 'B'
        },
        {
            'number': 8,
            'question': 'Which animal says "meow"?',
            'choices': {
                'A': 'Dog',
                'B': 'Cat',
                'C': 'Bird'
            },
            'correct': 'B'
        },
        {
            'number': 9,
            'question': 'What is the plural of "book"?',
            'choices': {
                'A': 'Book',
                'B': 'Books',
                'C': 'Bookes'
            },
            'correct': 'B'
        },
        {
            'number': 10,
            'question': 'Which season comes after summer?',
            'choices': {
                'A': 'Spring',
                'B': 'Winter',
                'C': 'Fall'
            },
            'correct': 'C'
        }
    ]
    
    if request.method == "POST":
        # Test cevaplarını kaydet
        for i in range(1, 11):
            answer = request.POST.get(f'question_{i}')
            if answer:
                InitialTestAnswer.objects.create(
                    user=request.user,
                    question_number=i,
                    answer=answer
                )
        
        messages.success(request, 'Başlangıç testiniz tamamlandı!')
        return redirect('dashboard')
    
    return render(request, 'initial_test.html', {
        'questions': test_questions
    })

@login_required(login_url='login')
def initial_test_results(request):
    """Başlangıç test sonuçlarını göster"""
    answers = InitialTestAnswer.objects.filter(user=request.user).order_by('question_number')
    
    if not answers.exists():
        return redirect('initial_test')
    
    return render(request, 'initial_test_results.html', {
        'answers': answers
    })
