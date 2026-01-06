<?php

namespace Jexactyl\Http\Controllers\Auth;

use Jexactyl\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Jexactyl\Http\Controllers\Controller;
use Jexactyl\Services\Users\UserCreationService;
use Jexactyl\Contracts\Repository\SettingsRepositoryInterface;

class GoogleController extends Controller
{
    private SettingsRepositoryInterface $settings;
    private UserCreationService $creationService;

    public function __construct(
        UserCreationService $creationService,
        SettingsRepositoryInterface $settings
    ) {
        $this->creationService = $creationService;
        $this->settings = $settings;
    }

    /**
     * Redirect to Google OAuth
     */
    public function index()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    /**
     * Handle Google callback
     */
    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();
            
            \Log::info('Google OAuth callback', [
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
            ]);
            
            // Check if user exists by google_id or email
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();
            
            if ($user) {
                \Log::info('Existing user found', ['user_id' => $user->id]);
                
                // User exists, update google_id if not set
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
                
                Auth::login($user, true);
                return redirect('/');
            }
            
            \Log::info('Creating new user from Google OAuth');
            
            // Create new user using UserCreationService (like Discord does)
            $approved = true;
            if ($this->settings->get('jexactyl::approvals:enabled') == 'true') {
                $approved = false;
            }
            
            $username = $this->generateUniqueUsername($googleUser->getName());
            
            $data = [
                'uuid' => Str::uuid()->toString(),
                'approved' => $approved,
                'email' => $googleUser->getEmail(),
                'username' => $username,
                'google_id' => $googleUser->getId(),
                'name_first' => $this->getFirstName($googleUser->getName()),
                'name_last' => $this->getLastName($googleUser->getName()),
                'password' => $this->genString(),
                'ip' => $request->getClientIp(),
                'store_cpu' => $this->settings->get('jexactyl::registration:cpu', 0),
                'store_memory' => $this->settings->get('jexactyl::registration:memory', 0),
                'store_disk' => $this->settings->get('jexactyl::registration:disk', 0),
                'store_slots' => $this->settings->get('jexactyl::registration:slot', 0),
                'store_ports' => $this->settings->get('jexactyl::registration:port', 0),
                'store_backups' => $this->settings->get('jexactyl::registration:backup', 0),
                'store_databases' => $this->settings->get('jexactyl::registration:database', 0),
            ];
            
            \Log::info('User creation data prepared', ['username' => $username]);
            
            $this->creationService->handle($data);
            
            \Log::info('User created via UserCreationService');
            
            // Find the newly created user and log in
            $user = User::where('google_id', $googleUser->getId())->first();
            
            if (!$user) {
                throw new \Exception('User was created but could not be found');
            }
            
            \Log::info('Logging in user', ['user_id' => $user->id]);
            
            Auth::loginUsingId($user->id, true);
            
            return redirect('/');
            
        } catch (\Exception $e) {
            \Log::error('Google OAuth Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return redirect('/auth/login')
                ->withErrors(['email' => 'Authentication failed: ' . $e->getMessage()]);
        }
    }
    
    private function getFirstName(string $fullName): string
    {
        $parts = explode(' ', $fullName);
        return $parts[0] ?? 'User';
    }
    
    private function getLastName(string $fullName): string
    {
        $parts = explode(' ', $fullName);
        return count($parts) > 1 ? end($parts) : '';
    }
    
    private function generateUniqueUsername(string $name): string
    {
        $baseUsername = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name));
        
        if (strlen($baseUsername) < 3) {
            $baseUsername = 'user' . $baseUsername;
        }
        
        $username = $baseUsername;
        $counter = 1;
        
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }
        
        return $username;
    }
    
    private function genString(): string
    {
        $chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        return substr(str_shuffle($chars), 0, 16);
    }
}