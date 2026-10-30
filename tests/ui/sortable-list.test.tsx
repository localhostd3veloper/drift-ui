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
    expect(screen.getAllByRole("listitem")[1]).toHaveTextContent(
      "Design review"
    )
    expect(onValueChange).not.toHaveBeenCalled()

    // Space drops the item
    await user.keyboard(" ")
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute(
      "aria-grabbed",
      "false"
    )
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[0],
      INITIAL_TASKS[2],
    ])
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
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent(
      "API integration"
    )

    // Escape cancels
    await user.keyboard("{Escape}")
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent(
      "Design review"
    )
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("keeps the Escape keypress from reaching a parent when cancelling", async () => {
    const user = userEvent.setup()
    const onParentKeyDown = vi.fn()

    render(
      <div onKeyDown={onParentKeyDown}>
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
      </div>
    )

    screen.getAllByRole("listitem")[0].focus()
    await user.keyboard(" ")
    await user.keyboard("{Escape}")
    expect(onParentKeyDown).not.toHaveBeenCalledWith(
      expect.objectContaining({ key: "Escape" })
    )
  })

  it("does not call onValueChange when an item is dropped in place", async () => {
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

    screen.getAllByRole("listitem")[0].focus()
    await user.keyboard(" ")
    await user.keyboard(" ")
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("drops the item when focus leaves it", async () => {
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

    screen.getAllByRole("listitem")[0].focus()
    await user.keyboard(" ")
    await user.keyboard("{ArrowDown}")
    await user.tab()

    expect(onValueChange).toHaveBeenCalledOnce()
    expect(
      screen
        .getAllByRole("listitem")
        .every((item) => item.getAttribute("aria-grabbed") === "false")
    ).toBe(true)
  })

  it("leaves typing in a control inside an item alone", async () => {
    const user = userEvent.setup()

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            <input aria-label={`Rename ${task.title}`} />
          </SortableItem>
        )}
      </SortableList>
    )

    const input = screen.getByLabelText("Rename Design review")
    await user.type(input, "a b")
    expect(input).toHaveValue("a b")
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute(
      "aria-grabbed",
      "false"
    )
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

    const handle = screen.getByRole("button", {
      name: "Reorder Design review",
    })
    expect(screen.getAllByRole("button")).toHaveLength(3)
    expect(handle.closest("li")).not.toHaveAttribute("tabindex")

    handle.focus()
    await user.keyboard(" ")
    expect(handle).toHaveAttribute("aria-pressed", "true")

    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowDown}")
    expect(handle).toHaveFocus()

    await user.keyboard(" ")
    expect(handle).toHaveAttribute("aria-pressed", "false")
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[2],
      INITIAL_TASKS[0],
    ])
  })

  it("disables the handle of a disabled item", () => {
    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        getKey={(t) => t.id}
      >
        {(task) => (
          <SortableItem
            key={task.id}
            value={task.id}
            disabled={task.id === "1"}
          >
            <SortableDragHandle />
            <span>{task.title}</span>
          </SortableItem>
        )}
      </SortableList>
    )

    expect(
      screen.getByRole("button", { name: "Reorder Design review" })
    ).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "Reorder Documentation" })
    ).toBeEnabled()
  })

  it("reorders items with numeric keys through a handle", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const items = [
      { id: 1, title: "First" },
      { id: 2, title: "Second" },
    ]

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={items}
        onValueChange={onValueChange}
      >
        {(task) => (
          <SortableItem key={task.id} value={task.id}>
            <SortableDragHandle />
            <span>{task.title}</span>
          </SortableItem>
        )}
      </SortableList>
    )

    screen.getByRole("button", { name: "Reorder First" }).focus()
    await user.keyboard(" ")
    await user.keyboard("{ArrowDown}")
    await user.keyboard(" ")
    expect(onValueChange).toHaveBeenCalledWith([items[1], items[0]])
  })

  it("passes the live order index to children while moving", async () => {
    const user = userEvent.setup()

    render(
      <SortableList
        aria-label="Tasks"
        defaultValue={INITIAL_TASKS}
        getKey={(t) => t.id}
      >
        {(task, index) => (
          <SortableItem key={task.id} value={task.id}>
            {index + 1}. {task.title}
          </SortableItem>
        )}
      </SortableList>
    )

    screen.getAllByRole("listitem")[0].focus()
    await user.keyboard(" ")
    await user.keyboard("{ArrowDown}")
    expect(screen.getAllByRole("listitem")[1]).toHaveTextContent(
      "2. Design review"
    )
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
    await user.keyboard(" ")
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
    await user.keyboard(" ")
    expect(onValueChange).toHaveBeenLastCalledWith([
      INITIAL_TASKS[1],
      INITIAL_TASKS[2],
      INITIAL_TASKS[0],
    ])
  })
})
