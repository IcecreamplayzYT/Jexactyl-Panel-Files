@extends('errors::minimal')
<link rel="icon" type="image/png" href="/assets/logo.png">
@section('title', __('Panel Under Maintenance'))

@section('message')
<div style="
    background:rgba(0, 0, 0, 0.4);
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 40px;
    max-width: 90vw;
    margin: 20px auto;
    text-align: center;
">
    <img src="/assets/logo.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
    <h1 style="color:rgb(255, 255, 255); font-size: 32px; font-weight: bold; margin-bottom: 20px;">Panel Under Maintenance</h1>    
    <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        We’re performing panel maintenance that won’t affect your hosting services. Check our Discord for updates on progress and timing.
    </p>
    
    <a href="https://discord.gg/neodesigns" style="
        background: #5865f2;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
    ">Join Discord</a>
</div>
@endsection