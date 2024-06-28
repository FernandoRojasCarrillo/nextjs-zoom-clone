// @ts-nocheck

"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {

  const { endedCalls, upcomingCalls, callRecording, isLoading } = useGetCalls();
  const [recordigns, setRecordigns] = useState<CallRecording[]>([])
  const router = useRouter();

  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordigns;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  }

  const getNoCallMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No Recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  }

  useEffect(() => {


    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(callRecording.map((meeting) => meeting.queryRecordings()))

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings)

        setRecordigns(recordings)
      } catch (error) {
        toast({
          title: "Error fetching recordings",
          description: "Please try again later",
          variant: "destructive",
        })
      }
    }

    if (type === "recordings") {
      fetchRecordings()
    }
  }, [type, callRecording])


  const calls = getCalls();
  const noCallMessage = getNoCallMessage();

  if (isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {calls && calls.length ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={meeting.id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
            }
            title={meeting.state?.custom?.description || meeting.filename || "Personal Meeting"}
            date={meeting.state?.startsAt?.toLocaleString() || meeting.start_time.toLocaleString()}
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recording" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            link={type === "recordings" ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
            handleClick={type === "recordings" ? () => router.push(meeting.url) : () => router.push(`/meeting/${meeting.id}`)}
          />
        ))
      ) : (
        <h1 className="text-center text-gray-500">{noCallMessage}</h1>
      )}
    </div>
  )
}

export default CallList