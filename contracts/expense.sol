// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ExpenseContract {
    struct Expense {
        uint256 id;
        string description;
        uint256 amount;
        address paidBy;
        address[] splitBetween;
        uint256 timestamp;
        bool isSettled;
    }

    struct Group {
        uint256 id;
        string name;
        address[] members;
        uint256[] expenseIds;
        address creator;
        uint256 createdAt;
    }

    mapping(uint256 => Expense) public expenses;
    mapping(uint256 => Group) public groups;
    mapping(address => uint256[]) public userGroups;

    uint256 public nextExpenseId;
    uint256 public nextGroupId;

    event GroupCreated(
        uint256 indexed groupId,
        string name,
        address indexed creator
    );
    event ExpenseAdded(
        uint256 indexed expenseId,
        uint256 indexed groupId,
        string description,
        uint256 amount
    );
    event ExpenseSettled(
        uint256 indexed expenseId,
        address indexed settler,
        uint256 amount
    );

    function createGroup(
        string memory _name,
        address[] memory _members
    ) public returns (uint256) {
        uint256 groupId = nextGroupId++;

        Group storage newGroup = groups[groupId];
        newGroup.id = groupId;
        newGroup.name = _name;
        newGroup.creator = msg.sender;
        newGroup.createdAt = block.timestamp;

        // Add creator to members if not already included
        bool creatorIncluded = false;
        for (uint i = 0; i < _members.length; i++) {
            newGroup.members.push(_members[i]);
            userGroups[_members[i]].push(groupId);
            if (_members[i] == msg.sender) {
                creatorIncluded = true;
            }
        }

        if (!creatorIncluded) {
            newGroup.members.push(msg.sender);
            userGroups[msg.sender].push(groupId);
        }

        emit GroupCreated(groupId, _name, msg.sender);
        return groupId;
    }

    function addExpense(
        uint256 _groupId,
        string memory _description,
        uint256 _amount,
        address[] memory _splitBetween
    ) public {
        require(_groupId < nextGroupId, "Group does not exist");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 expenseId = nextExpenseId++;

        Expense storage newExpense = expenses[expenseId];
        newExpense.id = expenseId;
        newExpense.description = _description;
        newExpense.amount = _amount;
        newExpense.paidBy = msg.sender;
        newExpense.timestamp = block.timestamp;
        newExpense.isSettled = false;

        for (uint i = 0; i < _splitBetween.length; i++) {
            newExpense.splitBetween.push(_splitBetween[i]);
        }

        groups[_groupId].expenseIds.push(expenseId);

        emit ExpenseAdded(expenseId, _groupId, _description, _amount);
    }

    function settleExpense(uint256 _expenseId) public payable {
        require(_expenseId < nextExpenseId, "Expense does not exist");

        Expense storage expense = expenses[_expenseId];
        require(!expense.isSettled, "Expense already settled");

        uint256 sharePerPerson = expense.amount / expense.splitBetween.length;
        require(msg.value >= sharePerPerson, "Insufficient payment");

        // Transfer payment to the person who paid the expense
        payable(expense.paidBy).transfer(sharePerPerson);

        // Return excess payment if any
        if (msg.value > sharePerPerson) {
            payable(msg.sender).transfer(msg.value - sharePerPerson);
        }

        emit ExpenseSettled(_expenseId, msg.sender, sharePerPerson);
    }

    function getGroup(uint256 _groupId) public view returns (Group memory) {
        require(_groupId < nextGroupId, "Group does not exist");
        return groups[_groupId];
    }

    function getExpense(
        uint256 _expenseId
    ) public view returns (Expense memory) {
        require(_expenseId < nextExpenseId, "Expense does not exist");
        return expenses[_expenseId];
    }

    function getUserGroups(
        address _user
    ) public view returns (uint256[] memory) {
        return userGroups[_user];
    }
}
