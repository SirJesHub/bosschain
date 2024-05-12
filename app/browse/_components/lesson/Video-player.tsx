"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
