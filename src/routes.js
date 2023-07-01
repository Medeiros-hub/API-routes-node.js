import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { builRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  // ROTA POST
  {
    method: 'POST',
    path: builRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "title or description are required" })
        )
      }

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', tasks)

      return res.writeHead(201).end()
    }
  },
  // ROTA GET
  {
    method: 'GET',
    path: builRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', {
        title: search,
        description: search
      })

      return res.end(JSON.stringify(tasks))
    }
  },
  // ROTA DELETE
  {
    method: 'DELETE',
    path: builRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const [task] = database.select('tasks', { id });

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not Found" })
        )
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  // ROTA PUT
  {
    method: 'PUT',
    path: builRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "title or description are required" })
        )
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not found"} )
        )
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  // ROTA PATCH
  {
    method: 'PATCH',
    path: builRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not found"} )
        )
      }

      const isTaskCompleted = !!task.completed_at
      const completed_at = isTaskCompleted ? null : new Date()

      database.update('tasks', id, { completed_at })

      return res.writeHead(200).end()
    }
  }
]