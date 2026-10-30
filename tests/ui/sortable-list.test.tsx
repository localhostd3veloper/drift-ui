import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  SortableDragHandle,
  SortableItem,
  SortableList,
} from "@/registry/default/ui/sortable-list"

interface Task {
  id: string
  title: string
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Design review" },
  { id: "2", title: "API integration" },
  { id: "3", title: "Documentation" },
]

describe("SortableList", () => {
  it("renders a list with list items and accessibility roles", () => {
    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            {task.title}
          </SortableItem>
        )}
      </SortableList>
    )

    expect(screen.getByRole("list", { name: "Tasks" })).toBeInTheDocument()
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveAttribute("aria-roledescription", "sortable item")
    expect(items[0]).toHaveAttribute("aria-grabbed", "false")
  })

  it("reorders items using keyboard Space and ArrowDown", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        onValueChange={onValueChange}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            {task.title}
          </SortableItem>
        )}
      </SortableList>
    )

    const items = screen.getAllByRole("listitem")
    items[0].focus()

    // Space picks up item 1
    await user.keyboard(" ")
    expect(items[0]).toHaveAttribute("aria-grabbed", "true")

    // ArrowDown moves it to index 1 (between 2 and 3)
    await user.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenLastCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[0],
      INITIAL_TASKS[2],
    ])

    // Space drops the item
    await user.keyboard(" ")
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute(
      "aria-grabbed",
      "false"
    )
  })

  it("cancels reorder when Escape is pressed", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        onValueChange={onValueChange}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            {task.title}
          </SortableItem>
        )}
      </SortableList>
    )

    const items = screen.getAllByRole("listitem")
    items[0].focus()

    // Pick up
    await user.keyboard(" ")
    // Move down
    await user.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenLastCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[0],
      INITIAL_TASKS[2],
    ])

    // Escape cancels
    await user.keyboard("{Escape}")
    expect(onValueChange).toHaveBeenLastCalledWith(INITIAL_TASKS)
  })

  it("supports SortableDragHandle", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        onValueChange={onValueChange}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            <SortableDragHandle />
            <span>{task.title}</span>
          </SortableItem>
        )}
      </SortableList>
    )

    const handles = screen.getAllByLabelText("Reorder item")
    expect(handles).toHaveLength(3)

    handles[0].focus()
    await user.keyboard(" ")
    expect(handles[0]).toHaveAttribute("aria-pressed", "true")

    await user.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenLastCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[0],
      INITIAL_TASKS[2],
    ])

    await user.keyboard(" ")
    expect(handles[0]).toHaveAttribute("aria-pressed", "false")
  })

  it("does not allow dragging or keyboard reordering when disabled", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        onValueChange={onValueChange}
        getKey={(t) => t.id}
        disabled
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            {task.title}
          </SortableItem>
        )}
      </SortableList>
    )

    const items = screen.getAllByRole("listitem")
    items[0].focus()
    await user.keyboard(" ")
    expect(items[0]).toHaveAttribute("aria-grabbed", "false")
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("supports horizontal orientation with ArrowRight and ArrowLeft", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <SortableList
        aria-label="Tabs"
        orientation="horizontal"
        defaultValue={INITIAL_TASKS}
        onValueChange={onValueChange}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            {task.title}
          </SortableItem>
        )}
      </SortableList>
    )

    const items = screen.getAllByRole("listitem")
    items[0].focus()
    await user.keyboard(" ")
    await user.keyboard("{ArrowRight}")
    expect(onValueChange).toHaveBeenLastCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[0],
      INITIAL_TASKS[2],
    ])
  })

  it("jumps to start and end with Home and End keys when grabbed", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        onValueChange={onValueChange}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            {task.title}
          </SortableItem>
        )}
      </SortableList>
    )

    const items = screen.getAllByRole("listitem")
    items[0].focus()
    await user.keyboard(" ")
    await user.keyboard("{End}")
    expect(onValueChange).toHaveBeenLastCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[2],
      INITIAL_TASKS[0],
    ])
  })
})
