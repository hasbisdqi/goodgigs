<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class JobCategoryController extends Controller
{
    public function index()
    {
        $categories = JobCategory::with('parent')->latest()->get();
        $parentCategories = JobCategory::whereNull('parent_id')->get();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_categories,name',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:job_categories,id',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        JobCategory::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, JobCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_categories,name,'.$category->id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:job_categories,id',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(JobCategory $category)
    {
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
