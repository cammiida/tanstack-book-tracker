---
marp: true
theme: default
backgroundColor: #191e26
color: #FEFEFE
---

![bg left:40% 80%](images/tanstack-logo.png)
![bg left:40% 80%](images/react-query-logo.png)

# The Power of <br/>Tanstack/React Query

---

- ## Hva er det?
- ## Hvordan bruke det?
- ## Praktisk eksempel
- ## Best practices

---

<!--
Så hva er Tanstack Query egentlig?
 -->

# Tanstack/React Query

---

# Tanstack Query

## Powerful asynchronous state management

TanStack Query (FKA React Query) is often described as the missing data-fetching library for web applications, but in more technical terms, it makes fetching, caching, synchronizing and updating server state in your web applications a breeze.

---

<!--
Wait a minute? Server state? Hva er det?
 -->

![bg left 50% 80%](https://media.giphy.com/media/tSI5rlnyCM10s/giphy.gif?cid=ecf05e47jb1jllvsbw7ub96voy1vjgsa0wsa3amm05s8727k&ep=v1_gifs_search&rid=giphy.gif&ct=g)

# "Server state"?

---

<!--
Så for dere som ikke er kjent med begrepene server og client state, tar jeg en liten refresher her.

Alt dette er server state i våre applikasjoner.
 -->

## Hva er server state?

- Data som du må hente fra (og synce med) et annet sted
- Eks:
  - Brukere
  - Datamodell
  - Prosess-state
  - Layout, osv
    er server state for vår del

---

<!--
Toggle theme.
Som kanskje flere har tenkt allerede er det veldig lite state som bare er client state i de fleste litt mer avanserte applikasjoner.
 -->

## Client state?

- State som appen eier og bare den trenger
- Synces ikke med noen ekstern ressurs
- Feks. theme

---

<!--
Så, vi skal hente data fra et annet sted. Hvordan ser dette ut sånn tradisjonelt, uten å bruke noe bibliotek?
-->

# Fetching av data uten React Query

---

<!--
- useEffect når komponenten laster
- sette masse state, holde den i sync
- isLoading, error, data...
- bare et enkelt eksempel i én komponent. Ingenting av
  - refetching
  - caching
  - gjenbruk
  - osv.
- klart, vi kunne abstrahert det hooks, men det blir fort ekstremt komplisert. Spesielt om man vil ha med caching.
- Har sett flere eksempler der folk har prøvd å skrive sånne fetching biblioteker selv, og det går alltid mye dårligere enn man tror.
- I siste tilfelle hos kunde.
-->

```tsx
export default function TestPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error>();

  const fetchBooks = async () => {
    if (!isLoading) {
      setIsFetching(true);
    }
    const response = await fetch("/api/books");
    if (response.status !== 200) {
      setError(new Error("An error occurred while fetching the books"));
      setIsFetching(false);
      return;
    }

    const books = await response.json();
    // Some schema validation...

    setBooks(books);
    setIsFetching(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchBooks();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    ...
  );
}
```

---

Ekstremt enkelt eksempel, men allerede flere problemer:

1. Sykt mye kode
2. Vedlikehold
3. Mye som kan gå galt
4. Caching???

![bg right height:0px](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExazdnaWdnc21wb3d2aXV1eGljbWtlZnUxazVuNWFhandzODhvdXlsbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dOl2LFw0RbTMc/giphy.gif)

---

Ekstremt enkelt eksempel, men allerede flere problemer:

1. Sykt mye kode
2. Vedlikehold
3. Mye som kan gå galt
4. Caching???

![bg right height:400px](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExazdnaWdnc21wb3d2aXV1eGljbWtlZnUxazVuNWFhandzODhvdXlsbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dOl2LFw0RbTMc/giphy.gif)

---

## Ett bibliotek for håndtering av server data

- Fetch
- Mutate
- Caching
- Refetch
- Offline
- Etc...

---

```ts
const {
  data,
  isLoading,
  isError,
  error,
  isFetching,
  dataUpdatedAt,
  etc...
} = useQuery({
  queryKey: [...]
  queryFn: async () => {
    ...
  }
  staleTime: 1000 * 60 * 5, // millisekunder
  gcTime: 1000 * 60 * 5, // millisekunder
  enabled: true,
  select: (data) => {data.filter(...)}
})
```

---

![bg center 50% ](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWY1bXhqbzV4MWUwdXczbWdybHYxNnVqcjV2OXFyY3EwM3BlbzZnNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26ufdipQqU2lhNA4g/giphy.gif)

---

```ts
const {
  data,
  isLoading,
  isError,
  error,
  isFetching,
  dataUpdatedAt,
  etc...
} = useQuery({
  queryKey: [...]
  queryFn: async () => {
    ...
  }
  staleTime: 1000 * 60 * 5, // millisekunder
  gcTime: 1000 * 60 * 5, // millisekunder
  enabled: true,
  select: (data) => {data.filter(...)}
})
```

---

# Praktisk eksempel

---

# Query Keys

- Hvor data er lagret i cachen
- Bruker man en nøkkel som allerede ligger i cachen, vil React Query hente dataen som ligger på denne nøkkelen (og refetche i bakgrunnen om den er stale)
- Alt som trengs for en query skal i nøkkelen:
  - Filtre, søkestrenger, id'er, etc...

Eksempel

```tsx
function Component() {
  const [filters, setFilters] = React.useState();
  const { data } = useQuery({
    queryKey: ["todos", filters],
    queryFn: () => fetchTodos(filters),
  });

  // ✅ set local state and let it drive the query
  return <Filters onApply={setFilters} />;
}
```

---

# Effektive Query Keys

1. Mest generisk -> mest spesifikk

```ts
["todos", "list", { filters: "all" }][("todos", "list", { filters: "done" })][
  ("todos", "detail", 1)
][("todos", "detail", 2)];
```

2. Query Key Factories

```ts
const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};
```

---

```ts
// 🕺 remove everything related
// to the todos feature
queryClient.removeQueries({
  queryKey: todoKeys.all,
});

// 🚀 invalidate all the lists
queryClient.invalidateQueries({
  queryKey: todoKeys.lists(),
});

// 🙌 prefetch a single todo
queryClient.prefetchQueries({
  queryKey: todoKeys.detail(id),
  queryFn: () => fetchTodo(id),
});
```
