export async function asyncForEach<T, R = any>(
    items: T[],
    iterator: (item: T, index: number) => Promise<R>,
): Promise<R[]> {

    const tasks = [];

    items.forEach((item, index) => {
        tasks.push(iterator(item, index));
    });

    return Promise.all(tasks);
}
