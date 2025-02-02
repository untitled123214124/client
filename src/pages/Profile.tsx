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
    setUser({ avatar_url: editedAvatarPreview, bio: editedBio });
    setIsEditMode(false);
  };

  const handleTechStackChange = (value: string) => {
    setSelectedTechStack((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value) 
        : [...prev, value]
    );
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
      console.log(accessToken)
      console.log(id)

      if (!accessToken || !id) {
        throw new Error("유효한 사용자 정보가 없습니다.");
      }

      const response = await fetch(
        `http://localhost:5000/auth/user/${id}`,
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
      console.log("Updated User Info:", result);

      if (!result.user) throw new Error("서버 응답에 user 데이터가 없습니다.");

      localStorage.setItem("userInfo", JSON.stringify(result.user));
      setUser(result.user);

      setIsEditMode(false);
      alert("바이오가 성공적으로 업데이트되었습니다.");
    } catch (err) {
      console.error("바이오 업데이트 중 오류 발생:", err);
      alert(err.message || "바이오 업데이트에 실패했습니다.");
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-screen p-8 absolute top-36">
        <Card className="pt-20 h-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl mb-6">
              Welcome back, {userInfo.username}!
            </CardTitle>
            <CardDescription>
              This is your Developer Profile of DevMate.
            </CardDescription>
            <CardContent className="items-center">
              <Button
                className="w-[300px] h-[60px] text-xl font-semibold mr-6 mt-6 bg-blue-500 hover:bg-blue-600"
                onClick={handlePost}
              >
                Create New Post
              </Button>
              <Button className="w-[300px] h-[60px] text-xl font-semibold bg-green-500 hover:bg-green-600">
                Search Posts
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      <div className="w-screen flex p-8 absolute">
        <Card className="w-1/2 flex-col h-[400px] mr-4">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <div
              className="avatar rounded-full w-24 h-24 bg-cover bg-center mb-6 cursor-pointer relative"
              style={{
                backgroundImage: `url(${isEditMode ? editedAvatarPreview : userInfo.avatar_url})`,
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
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm rounded-full">
                    Change Photo
                  </div>
                </>
              )}
            </div>

            <div className="text-lg font-semibold mb-4">{userInfo.username}</div>

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
                 type="multiple"  // multiple 모드 활성화 (여러 개 선택 가능)
                 value={selectedTechStack}  // 선택된 값 배열을 value로 설정
                 onValueChange={setSelectedTechStack}  // 값을 배열로 상태 업데이트
                 variant="outline"
               >
                 <ToggleGroupItem value="react">React</ToggleGroupItem>
                 <ToggleGroupItem value="java">Java</ToggleGroupItem>
                 <ToggleGroupItem value="python">Python</ToggleGroupItem>
                 <ToggleGroupItem value="typescript">TypeScript</ToggleGroupItem>
               </ToggleGroup>
             </DialogContent>
           </Dialog>
            )}

            {isEditMode ? (
              <>
                <Button className="bg-green-500 text-white mt-4" onClick={handleSaveProfile}>
                  Save Profile
                </Button>
                <Button className="bg-gray-500 text-white mt-2" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button className="top-2 left-2 bg-blue-500 text-white" onClick={() => setIsEditMode(true)}>
                Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Textarea
                className="h-[230px]"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Please Introduce yourself to other Developers in DevMate!"
              />
            ) : (
              <p>{userInfo.bio || "Introduce yourself here!"}</p>
            )}
          </CardContent>
          <CardFooter>
            {isEditMode ? (
              <>
                <Button className="bg-green-500 text-white" onClick={handleUpdateBio}>
                  Save Bio
                </Button>
                <Button className="bg-gray-500 text-white" onClick={() => setIsEditMode(false)}>
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
  );
};

export default Profile;