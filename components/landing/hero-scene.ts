export type SceneFocus = "tags" | "replicas" | "artifacts" | "deploy" | null

export type DeployState = "draft" | "pressed" | "deploying" | "live"

export type SceneState = {
  focus: SceneFocus
  stepFrame: number
  tagsFrame: number
  replicasFrame: number
  replicas: number
  dropFrame: number
  deploy: DeployState
}

const TAGS_IDLE_FRAME = 14
const TAGS_COMMITTED_FRAME = 6
const DROP_IDLE_FRAME = 63
const DROP_DONE_FRAME = 24
const DROP_UPLOAD_START = 4
const BASE_REPLICAS = 3

export const SCENE_FRAME_MS = 300
export const SCENE_FRAME_COUNT = 44
export const SCENE_DONE_FRAME = 33

const IDLE: SceneState = {
  focus: "tags",
  stepFrame: 1,
  tagsFrame: TAGS_IDLE_FRAME,
  replicasFrame: 0,
  replicas: BASE_REPLICAS,
  dropFrame: DROP_IDLE_FRAME,
  deploy: "draft",
}

function withReplicas(state: SceneState, replicasFrame: number): SceneState {
  return { ...state, replicasFrame, replicas: BASE_REPLICAS + replicasFrame }
}

function configured(frame: number): SceneState {
  const typed = { ...IDLE, tagsFrame: TAGS_COMMITTED_FRAME }
  if (frame < 11) return typed
  if (frame < 15)
    return withReplicas(
      { ...typed, focus: "replicas" },
      Math.min(frame - 11, 2)
    )
  const uploading = withReplicas({ ...typed, focus: "artifacts" }, 2)
  if (frame < 17) return { ...uploading, dropFrame: (frame - 15) * 2 }
  if (frame < 25)
    return {
      ...uploading,
      dropFrame: DROP_UPLOAD_START + Math.round((frame - 17) * 2.5),
    }
  return { ...uploading, dropFrame: DROP_DONE_FRAME }
}

export function sceneAt(frame: number): SceneState {
  if (frame < 3) return IDLE
  if (frame < 9) return { ...IDLE, tagsFrame: frame - 3 }
  if (frame < 26) return configured(frame)
  const ready = { ...configured(25), focus: "deploy" as const, stepFrame: 2 }
  if (frame < 27) return ready
  if (frame < 28) return { ...ready, deploy: "pressed" }
  if (frame < SCENE_DONE_FRAME)
    return { ...ready, stepFrame: 3, deploy: "deploying" }
  return {
    ...ready,
    focus: null,
    stepFrame: 4,
    deploy: "live",
  }
}
