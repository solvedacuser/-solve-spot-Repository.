"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect, use } from "react";
import { TiUserDeleteOutline } from "react-icons/ti";
import { PiSealWarningThin } from "react-icons/pi";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";

interface BarChartProps {
  labels: string[];
  labelTitle: string;
  data: number[];
  chartTitle: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function BarChart({
  labels,
  labelTitle,
  data,
  chartTitle,
}: BarChartProps) {
  return (
    <Bar
      data={{
        labels: labels,
        datasets: [
          {
            label: labelTitle,
            data: data,
            backgroundColor: [
              "#4F46E5",
              "#10B981",
              "#0EA5E9",
              "#F59E0B",
              "#F43F5E",
              "#8B5CF6",
              "#64748B",
            ],
            borderRadius: 15,
            barPercentage: 0.5,
            categoryPercentage: 0.7,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: chartTitle,
          },
        },
        scales: {
          y: {
            ticks: {
              precision: 0,
              stepSize: 1,
            },
          },
        },
      }}
    ></Bar>
  );
}

export function SectionToDeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alerts, setAlerts] = useState("");
  const confirmString = "삭제하겠습니다";

  const supabase = createClient();
  const router = useRouter();

  async function deleteAccount() {
    console.log("실행됨");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAlerts("info");
        setShowAlert(true);
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setAlerts("success");
      setShowAlert(true);
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error);
      setAlerts("error");
      setShowAlert(true);
    }
  }
  return (
    <>
      <div className="wrapper_delete w-[100%] mt-20">
        <div className="redbox bg-red-100 border-red-200 border rounded-2xl px-5 py-3 flex flex-row justify-between">
          <div className="caution">
            <div>
              <span className="text-xl font-semibold">! Delete Account</span>
            </div>
            <div>
              <span className="text-sm text-red-800">
                If you delete your account, all data will be permanently deleted
                and cannot be recovered.
              </span>
            </div>
          </div>
          <button
            className="text-white bg-red-500 rounded-lg px-2 py-1 h-full"
            onClick={(e) => {
              setIsOpen(true);
            }}
          >
            계정 삭제
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className=" bg-white rounded-xl p-7 space-y-3">
            <div className="flex flex-row items-center">
              <TiUserDeleteOutline className="inline-block w-10 h-10 mr-2 text-red-500"></TiUserDeleteOutline>
              <span className="font-bold text-black text-xl md:text-2xl">
                계정 삭제
              </span>
            </div>
            <p className="text-base text-gray-500 font-medium">
              계정을 삭제하시겠습니까?
            </p>
            <div className="bg-red-100 rounded-lg border border-red-900 p-3">
              <div className="mb-2 flex flex-row items-center">
                <PiSealWarningThin className="inline-block w-8 h-8 mr-1 text-black text-red-500" />
                <span className="text-red-700 font-semibold">주의 사항</span>
              </div>
              <ul className="space-y-2">
                <li className="list-disc ml-5 text-red-500 font-medium">
                  삭제된 계정 정보는 다시 되돌릴 수 없습니다.
                </li>
                <li className="list-disc ml-5 text-red-500 font-medium">
                  모든 데이터가 영구적으로 삭제됩니다.
                </li>
              </ul>
            </div>
            <form>
              <label className="inline-block mt-3 mb-2 text-gray-700 font-semibold">
                계정 삭제를 계속하려면,
                <span className="text-red-600 font-semibold">
                  "{confirmString}"
                </span>
                를 입력하세요.
              </label>

              <input
                type="text"
                placeholder={confirmString}
                onChange={(e) => {
                  if (e.target.value == confirmString) {
                    setIsValid(true);
                  } else {
                    setIsValid(false);
                  }
                }}
                className="w-full p-3 border border-gray-500 rounded-xl"
              ></input>
            </form>
            <div className="flex flex-row justify-between gap-5">
              <button
                className="rounded-xl w-[100%] py-3 text-black bg-gray-200"
                onClick={() => {
                  setIsOpen(false);
                  setIsValid(false);
                }}
              >
                취소
              </button>
              <button
                className={`rounded-xl w-[100%] py-3 ${isValid ? "text-red-500 bg-red-200 hover:bg-red-300" : "text-gray-100 bg-gray-400"}`}
                disabled={!isValid}
                onClick={() => {
                  deleteAccount();
                }}
              >
                계정 삭제
              </button>
            </div>
          </div>
          {showAlert && (
            <Snackbar
              open={showAlert}
              autoHideDuration={3000}
              onClose={() => setShowAlert(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              {alerts == "success" ? (
                <Alert
                  severity="success"
                  sx={{ width: "100%" }}
                  onClose={() => setShowAlert(false)}
                >
                  <AlertTitle>성공</AlertTitle>
                  계정 삭제가 성공적으로 완료되었습니다.
                </Alert>
              ) : alerts == "info" ? (
                <Alert
                  severity="info"
                  sx={{ width: "100%" }}
                  onClose={() => setShowAlert(false)}
                >
                  {" "}
                  <AlertTitle>알림</AlertTitle>로그인 정보가 없습니다.
                </Alert>
              ) : alerts == "error" ? (
                <Alert
                  severity="error"
                  sx={{ width: "100%" }}
                  onClose={() => setShowAlert(false)}
                >
                  <AlertTitle>오류</AlertTitle>탈퇴 처리 중 오류가 발생했습니다.
                </Alert>
              ) : undefined}
            </Snackbar>
          )}
        </div>
      )}
    </>
  );
}
