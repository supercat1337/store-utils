// @ts-check

/** @typedef {{task_id: string; text:string; done:boolean}} ItemData */

class TaskService {
    #max_id = 0;

    /** @type {Map<string, ItemData>}  */
    #tasks = new Map;

    /**
     * @param {{text:string; done:boolean}} data 
     */
    async add(data) {
        let task_id = String(++this.#max_id);
        let value = { ...data, task_id };
        this.#tasks.set(task_id, value);
        return value;
    }

    async requestData() {
        return Array.from(this.#tasks.values());
    }

    /**
     * @param {string} task_id 
     */
    async delete(task_id) {
        if (this.#tasks.has(task_id)) {
            return this.#tasks.delete(task_id);
        }

        return false;
    }

    /**
     * @param {ItemData} task 
     */
    async update(task) {
        if (!this.#tasks.has(task.task_id)) return;
        this.#tasks.set(task.task_id, task);
    }
}


const tasks_service = new TaskService;
globalThis.tasks_service = tasks_service;

for (let i = 1; i <= 50; i++) {
    tasks_service.add({ text: `item ${i}`, done: false })
}

export {tasks_service};