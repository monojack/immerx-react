<img src="images/immerx-react-logo.svg" height="70px"/>

**React** bindings for [ImmerX](https://github.com/monojack/immerx)

<br/>

### `Basic usage`

The following example assumes that you are already familiar with **ImmerX**

**`index.js`**

```js
import React from 'react'
import { render } from 'react-dom'
import { create } from '@immerx/react'

import App from './App'

import './styles.css'

create({
  counter: { count: 0 },
  times: 0,
})

const rootElement = document.getElementById('root')
render(<App />, rootElement)
```

**`App.js`**

```js
import React from 'react'
import { useImmerx } from '@immerx/react'

import Counter from './Counter'

export default function App() {
  const [state] = useImmerx()

  return (
    <>
      <Counter />
      <p>You clicked: {state.times} times </p>
    </>
  )
}
```

**`Counter.js`**

```js
import React from 'react'
import { useImmerx } from '@immerx/react'

const lens = {
  get: state => state.counter,
  set: (stateDraft, counter) => {
    stateDraft.counter = counter
    stateDraft.times += 1
  },
}

export default function Counter() {
  const [state, update] = useImmerx(lens)

  const increment = () => update(draft => void (draft.count += 1))
  const decrement = () => update(draft => void (draft.count -= 1))

  return (
    <>
      <p>count: {state.count}</p>
      <button onClick={decrement}> - </button>
      <button onClick={increment}> + </button>
    </>
  )
}
```

[![Edit immerx-react-counter](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/immerx-react-counter-ie5ce?fontsize=14&hidenavigation=1&theme=dark)

**NOTE:** Always memoize your lenses or define them outside the function if they're not derived from props, because the `state$` observable synchronously emits the current state value to incoming subscribers.

Otherwise, the isolated `state` will emit an update
**->** the `lens` is re-created
**->** a new isolated `state` is created with the new `lens` and it emits another update
**->** the `lens` is re-created
...
:boom: :fire: :fire:
