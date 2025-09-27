import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ExpenseAdded } from "../generated/schema"
import { ExpenseAdded as ExpenseAddedEvent } from "../generated/ExpenseContract/ExpenseContract"
import { handleExpenseAdded } from "../src/expense-contract"
import { createExpenseAddedEvent } from "./expense-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let expenseId = BigInt.fromI32(234)
    let groupId = BigInt.fromI32(234)
    let description = "Example string value"
    let amount = BigInt.fromI32(234)
    let newExpenseAddedEvent = createExpenseAddedEvent(
      expenseId,
      groupId,
      description,
      amount
    )
    handleExpenseAdded(newExpenseAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ExpenseAdded created and stored", () => {
    assert.entityCount("ExpenseAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "expenseId",
      "234"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "groupId",
      "234"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "description",
      "Example string value"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
