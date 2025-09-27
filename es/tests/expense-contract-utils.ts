import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ExpenseAdded,
  ExpenseSettled,
  GroupCreated
} from "../generated/ExpenseContract/ExpenseContract"

export function createExpenseAddedEvent(
  expenseId: BigInt,
  groupId: BigInt,
  description: string,
  amount: BigInt
): ExpenseAdded {
  let expenseAddedEvent = changetype<ExpenseAdded>(newMockEvent())

  expenseAddedEvent.parameters = new Array()

  expenseAddedEvent.parameters.push(
    new ethereum.EventParam(
      "expenseId",
      ethereum.Value.fromUnsignedBigInt(expenseId)
    )
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return expenseAddedEvent
}

export function createExpenseSettledEvent(
  expenseId: BigInt,
  settler: Address,
  amount: BigInt
): ExpenseSettled {
  let expenseSettledEvent = changetype<ExpenseSettled>(newMockEvent())

  expenseSettledEvent.parameters = new Array()

  expenseSettledEvent.parameters.push(
    new ethereum.EventParam(
      "expenseId",
      ethereum.Value.fromUnsignedBigInt(expenseId)
    )
  )
  expenseSettledEvent.parameters.push(
    new ethereum.EventParam("settler", ethereum.Value.fromAddress(settler))
  )
  expenseSettledEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return expenseSettledEvent
}

export function createGroupCreatedEvent(
  groupId: BigInt,
  name: string,
  creator: Address
): GroupCreated {
  let groupCreatedEvent = changetype<GroupCreated>(newMockEvent())

  groupCreatedEvent.parameters = new Array()

  groupCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return groupCreatedEvent
}
