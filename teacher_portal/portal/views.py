from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST
from .models import Student
from .forms import StudentForm


@login_required
def student_list(request):
    students = Student.objects.all().order_by("name", "subject")
    return render(request, "portal/student_list.html", {"students": students})

@login_required
@require_POST
# def add_student(request):
#     form = StudentForm(request.POST)
#     if form.is_valid():
#         name = form.cleaned_data["name"]
#         subject = form.cleaned_data["subject"]
#         marks = form.cleaned_data["marks"]
#         student, created = Student.objects.get_or_create(name=name, subject=subject, defaults={"marks": marks})
#         if not created:
#             student.marks += marks
#             student.save()
#         return JsonResponse({"success": True, "student_id": student.id, "created": created, "new_marks": student.marks})
#     return JsonResponse({"success": False, "errors": form.errors}, status=400)

def add_student(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        subject = request.POST.get('subject')
        marks = request.POST.get('marks')

        if not (name and subject and marks):
            return JsonResponse({"success": False, "error": "Missing required fields."}, status=400)

        try:
            marks = int(marks)
        except ValueError:
            return JsonResponse({"success": False, "error": "Marks must be an integer."}, status=400)

        try:
            student = Student.objects.get(name=name, subject=subject)
            student.marks += marks
            student.save()
            created = False
        except Student.DoesNotExist:
            student = Student.objects.create(name=name, subject=subject, marks=marks)
            created = True

        return JsonResponse({
            "success": True,
            "student_id": student.id,
            "created": created,
            "total_marks": student.marks
        })

    return JsonResponse({"success": False, "error": "Invalid request method."}, status=405)


@login_required
@require_POST
def update_student(request, pk):
    student = get_object_or_404(Student, pk=pk)
    field = request.POST.get("field")
    value = request.POST.get("value")
    if field not in ["name", "subject", "marks"]:
        return HttpResponseBadRequest("Invalid field")
    setattr(student, field, value)
    student.save()
    return JsonResponse({"success": True})

@login_required
@require_POST
def delete_student(request, pk):
    student = get_object_or_404(Student, pk=pk)
    student.delete()
    return JsonResponse({"success": True})




@require_POST
def edit_student(request, id):
    try:
        student = Student.objects.get(id=id)
        student.name = request.POST.get('name')
        student.subject = request.POST.get('subject')
        student.marks = request.POST.get('marks')
        student.save()
        return JsonResponse({'success': True})
    except Student.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Student not found'})
