import {
  ExpenseAdded as ExpenseAddedEvent,
  ExpenseSettled as ExpenseSettledEvent,
  GroupCreated as GroupCreatedEvent
} from "../generated/ExpenseContract/ExpenseContract"
import { ExpenseAdded, ExpenseSettled, GroupCreated } from "../generated/schema"

export function handleExpenseAdded(event: ExpenseAddedEvent): void {
  let entity = new ExpenseAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.expenseId = event.params.expenseId
  entity.groupId = event.params.groupId
  entity.description = event.params.description
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExpenseSettled(event: ExpenseSettledEvent): void {
  let entity = new ExpenseSettled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.expenseId = event.params.expenseId
  entity.settler = event.params.settler
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGroupCreated(event: GroupCreatedEvent): void {
  let entity = new GroupCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupId = event.params.groupId
  entity.name = event.params.name
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
