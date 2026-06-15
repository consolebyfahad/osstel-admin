"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, Save, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { AdminAvatar } from "@/components/AdminAvatar";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfilePageContent() {
  const router = useRouter();
  const { user, avatarUrl: storedAvatarUrl, updateProfile, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(storedAvatarUrl);
    }
  }, [user, storedAvatarUrl]);

  if (!user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile({ name, avatarUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleRemoveImage = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSaved(false);
  };

  return (
    <>
      <Navbar
        title="Profile"
        description="Manage your admin account"
      />

      <div className="p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-blue-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative group">
                  <AdminAvatar
                    name={name || user.name}
                    avatarUrl={avatarUrl}
                    size="xl"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {name || user.name}
                    </p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      Role: {user.role}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Button>
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        Remove Photo
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Display Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSaved(false);
                    }}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Phone</Label>
                  <Input
                    id="profile-phone"
                    value={user.phone}
                    disabled
                    className="bg-gray-50 text-gray-500"
                  />
                </div>

                <Button onClick={handleSave} className="w-full sm:w-auto">
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-red-700">
                <LogOut className="h-4 w-4" />
                Logout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Sign out of your admin account. You will need to sign in again to
                access the dashboard.
              </p>
              <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <AdminAvatar
                  name={user.name}
                  avatarUrl={avatarUrl ?? storedAvatarUrl}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {name || user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.phone}</p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
