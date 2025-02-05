import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import useUserStore from "@/stores/userStore";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { username, id, avatar_url, bio, userStatus, setUser } = useUserStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAvatarPreview, setEditedAvatarPreview] = useState(avatar_url);
  const [editedBio, setEditedBio] = useState(bio);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else if (username && id) {
      setUserInfo({ username, id, avatar_url, bio, userStatus });
    }
  }, [username, id, avatar_url, bio, userStatus]);

  const handleSaveProfile = () => {
    setUser(
      userInfo.username,
      userInfo.id,
      editedAvatarPreview,
      editedBio,
      userInfo.userStatus
    );
    setIsEditMode(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    navigate("/newpost");
  };

  const handleUpdateBio = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || !id) {
        throw new Error("유효한 사용자 정보가 없습니다.");
      }

      const response = await fetch(
        `http://dev-mate.glitch.me/auth/user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ bio: editedBio }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();

      if (!result.user) throw new Error("서버 응답에 user 데이터가 없습니다.");

      localStorage.setItem("userInfo", JSON.stringify(result.user));
      setUser(
        result.user.username,
        result.user.id,
        result.user.avatar_url,
        result.user.bio,
        result.user.userStatus
      );

      setIsEditMode(false);
      alert("바이오가 성공적으로 업데이트되었습니다.");
    } catch (err: any) {
      console.error("바이오 업데이트 중 오류 발생:", err);
      alert(err.message || "바이오 업데이트에 실패했습니다.");
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-8 w-full h-full">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl mb-6">
              Welcome back, {userInfo.username}!
            </CardTitle>
            <CardDescription>
              This is your Developer Profile of DevMate.
            </CardDescription>
            <CardContent>
              <Button
                className="w-[300px] h-[60px] text-xl font-semibold mr-6 mt-6 bg-blue-500 hover:bg-blue-600"
                onClick={handlePost}
              >
                Create New Post
              </Button>
              <Button className="w-[300px] h-[60px] text-xl font-semibold mt-6 bg-green-500 hover:bg-green-600">
                Search Posts
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
        <div className="flex">
          <Card className="w-1/2">
            <CardContent className="flex flex-col items-center">
              <div
                className="avatar rounded-full w-24 h-24 bg-cover bg-center mb-6"
                style={{
                  backgroundImage: `url(${
                    isEditMode ? editedAvatarPreview : userInfo.avatar_url
                  })`,
                }}
                onClick={() =>
                  isEditMode && document.getElementById("avatarInput")?.click()
                }
              >
                {isEditMode && (
                  <>
                    <input
                      type="file"
                      id="avatarInput"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <div className=" bg-black bg-opacity-50 flex items-center justify-center text-white text-sm rounded-full">
                      Change Photo
                    </div>
                  </>
                )}
              </div>
              <div className="text-lg font-semibold mb-4">
                {userInfo.username}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedTechStack.length > 0 ? (
                  selectedTechStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-200 text-blue-800 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No Tech Stack Selected</p>
                )}
              </div>

              {isEditMode && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Select Your Tech Stack</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ToggleGroup
                      type="multiple"
                      value={selectedTechStack}
                      onValueChange={setSelectedTechStack}
                      variant="outline"
                    >
                      <ToggleGroupItem value="react">React</ToggleGroupItem>
                      <ToggleGroupItem value="java">Java</ToggleGroupItem>
                      <ToggleGroupItem value="python">Python</ToggleGroupItem>
                      <ToggleGroupItem value="typescript">
                        TypeScript
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </DialogContent>
                </Dialog>
              )}

              {/* 프로필 수정 버튼 */}
              {isEditMode ? (
                <>
                  <Button
                    className="bg-green-500 text-white mt-4"
                    onClick={handleSaveProfile}
                  >
                    Save Profile
                  </Button>
                  <Button
                    className="bg-gray-500 text-white mt-2"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-blue-500 text-white"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 자기소개 카드 */}
          <Card className="w-1/2 ml-6">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <Textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Please introduce yourself to other Developers in DevMate!"
                />
              ) : (
                <p>{userInfo.bio || "Introduce yourself here!"}</p>
              )}
            </CardContent>
            <CardFooter>
              {isEditMode ? (
                <>
                  <Button
                    className="bg-green-500 text-white"
                    onClick={handleUpdateBio}
                  >
                    Save Bio
                  </Button>
                  <Button
                    className="bg-gray-500 text-white"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditMode(true)}>Edit Bio</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
